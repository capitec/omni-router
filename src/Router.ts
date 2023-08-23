import { Route, RouteAnimationIn, RouteAnimationOut, RouterEventCallback, RouterEventType, RoutedLocation } from './types.js';

/**
 * Map of subscribers that listen to router events.
 */
type RouteEventListenersMap = {
	'route-loading': RouterEventCallback[];
	'route-loaded': RouterEventCallback[];
};

/**
 * The function to render the page when routing occurs.
 */
export type RouteNavigationFunction = (route: RoutedLocation, animation?: RouteAnimationIn | RouteAnimationOut) => Promise<void>;

/**
 * Simple path-based web component router that enables navigation to a list of registered routes.
 *
 * Requires an <omni-router-outlet/> outlet to be defined in your web app.
 *
 * Usage:
 * ```js
 *   // Initialize the router.
 *   const router = Router.getInstance();
 *
 *   // Register the list of routes.
 *   router.addRoute({
 *     name: 'view-todos',
 *     title: 'Todo List',
 *     path: '/todos',
 *     load: () => import('Todos.js'),
 *     isDefault: true
 *   });
 *
 *   router.addRoute({
 *     name: 'view-edit-todo',
 *     title: 'Edit Todo',
 *     path: '/todos/:id',
 *     load: () => import('EditTodo.js')
 *   });
 *
 *   router.addRoute({
 *     name: 'view-page-not-found',
 *     title: 'Page Not Found',
 *     path: '/error404',
 *     load: () => import('PageNotFound.js'),
 *     isFallback: true
 *   });
 *
 *   // Load the route matching the current browser path.
 *   router.load();
 *
 *   // EXAMPLES
 *   // router.push(window.location.path); // Load the route current browser path.
 *   // router.push('/todos'); // Navigate to the todo page.
 *   // router.push('/todos/5'); // Navigate to the edit todo page.
 *   // router.replace('/todos/5'); // Navigate to the edit todo page, replacing the current browser history item.
 * ```
 *
 * ```html
 *   <omni-router-outlet></omni-router-outlet>
 * ```
 */
class RouterImpl {

	/** The registered route configurations. */
	private _routes: Route[] = [];

	/** Map of the events dispatch by the router and their listeners. */
	private _eventListeners: RouteEventListenersMap = {
		'route-loading': [],
		'route-loaded': []
	};

	/** The current location routed to. */
	private _currentLocation?: RoutedLocation;

	/** The previous location routed to.  */
	private _previousLocation?: RoutedLocation;

	/** The router outlet rendering function to call when a route navigation occurs. */
	onNavigate?: RouteNavigationFunction;

	// --------------
	// INITIALIZATION
	// --------------

	/**
	 * Initialize the router.
	 */
	constructor() {

		// Update the visible route when browser navigation buttons are pressed or the History API is used directly to navigate.
		window.addEventListener('popstate', async () => { // eslint-disable-line @typescript-eslint/no-misused-promises
			await this._onPopState()
		});
	}

	/**
	 * Get the singleton instance of the router.
	 * 
	 * @deprecated Use Router module directly instead, e.g. Router.addRoute(...) instead of Router.getInstance.addRoute()
	 * 
	 * @returns The router instance.
	 */
	getInstance(): this {

		return this;
	}

	// ----------
	// PROPERTIES
	// ----------

	/**
	 * Get the currently location routed to.
	 *
	 * @readonly
	 * 
	 * @returns The routed location information.
	 */
	get currentLocation(): RoutedLocation | undefined {

		return this._currentLocation;
	}

	/**
	 * Get the previous location routed to.
	 *
	 * @readonly
	 * 
	 * @returns The routed location information.
	 */
	get previousLocation(): RoutedLocation | undefined {

		return this._previousLocation;
	}

	/**
	 * Get the route that should be rendered when navigating to the app base URL.
	 * 
	 * @readonly
	 * 
	 * @returns The route configuration details.
	 */
	get defaultRoute(): Route | undefined {

		return this._routes.find(r => r.isDefault);
	}

	/**
	 * Get the route that should be rendered when navigating to a route that does not exist.
	 * 
	 * @readonly
	 * 
	 * @returns The route configuration details.
	 */
	get fallbackRoute(): Route | undefined {

		return this._routes.find(r => r.isFallback);
	}

	// --------------
	// PUBLIC METHODS
	// --------------

	/**
	 * Registers a callback function to be invoked when the router dispatches an event.
	 * 
	 * @param eventName - The name of the event to subscribe to.
	 * @param callback - The function to invoke when the event occurs.
	 */
	addEventListener(eventName: RouterEventType, callback: RouterEventCallback): void {

		// Validate the function parameters.
		if (!eventName) {
			throw new Error('[Router] No event name provided.');
		}

		if (!Object.keys(this._eventListeners).includes(eventName)) {
			throw new Error(`[Router] Invalid event name provided. Valid options include: ${Object.keys(this._eventListeners).join(', ')}`);
		}

		if (!callback) {
			throw new Error('[Router] No callback function provided.');
		}

		// Add the callback to the event listeners.
		this._eventListeners[eventName].push(callback);
	}

	/**
	 * Removes a callback function from the list of functions to be invoked when the router dispatches an event.
	 * 
	 * @param eventName - The name of the event to subscribe to.
	 * @param callback - The function to invoke when the event occurs.
	 */
	removeEventListener(eventName: RouterEventType, callback: () => void): void {

		// Validate the function parameters.
		if (!eventName) {
			throw new Error('[Router] No event name provided.');
		}

		if (!Object.keys(this._eventListeners).includes(eventName)) {
			throw new Error(`[Router] Invalid event name provided. Valid options include: ${Object.keys(this._eventListeners).join(', ')}`);
		}

		if (!callback) {
			throw new Error('[Router] No callback function provided.');
		}

		// Remove the callback from the event listeners.
		this._eventListeners[eventName] = this._eventListeners[eventName].filter(listener => listener !== callback);
	}

	/**
	 * Add a route from the list of navigable routes.
	 *
	 * @param route - The route configuration details.
	 */
	addRoute(route: Route): void {

		// Validate route details.
		if (!route) {
			throw new Error('[Router] No route provided');
		}

		if (!route.name) {
			throw new Error('[Router] No route name provided');
		}

		if (!route.path) {
			throw new Error('[Router] No route path provided');
		}

		// Prevent duplicate route registration.
		if (this._routes.find(r => r.name === route.name)) {
			throw new Error(`[Router] Route with name "${route.name}" already exists`);
		}

		if (this._routes.find(r => r.path === route.path)) {
			throw new Error(`[Router] Route with path "${route.path}" already exists`);
		}

		// Add the route to the navigable routes.
		this._routes.push(route);

		// If the given route is set as default, then clear the default flag off all other routes.
		if (route.isDefault) {
			this.setDefault(route.name);
		}

		// If the given route is set as fallback, then clear the fallback flag off all other routes.
		if (route.isFallback) {
			this.setFallback(route.name);
		}
	}

	/**
	 * Remove a route from the list of navigable routes.
	 *
	 * @param name - The name of the route to set as fallback.
	 */
	removeRoute(name: string): void {

		this._routes = this._routes.filter(route => route.name !== name);
	}

	/**
	 * Get the registered route for the given path.
	 * 
	 * @param pathOrUrl - The path part or URL to lookup the route for.
	 * 
	 * @returns The route configuration details.
	 */
	getRouteForPath(pathOrUrl: string): Route | null {

		// Extract the path part from the given URL.
		let path = pathOrUrl.replace(window.location.origin, '');

		if (path.indexOf('?') !== -1) {
			path = path.substring(0, path.indexOf('?'));
		}
		if (path.indexOf('#') !== -1) {
			path = path.substring(0, path.indexOf('#'));
		}

		// Return the default route if the web app base URL is requested and a default route is set.
		if ((!path || path === '/') && this.defaultRoute) {
			return this.defaultRoute;
		}

		// Lookup and return the route that best matches the search path if a path match is found.
		const lookupRoute = this._routes.find(r => {

			const routeParts = r.path.split('/');

			for (let i = 0; i < routeParts.length; i++) {

				if (routeParts[i].endsWith('?')) {
					routeParts[i] = '?[-.a-zA-Z0-9]*';
				} else if (routeParts[i].startsWith(':')) {
					routeParts[i] = '[-.a-zA-Z0-9]+';
				}
			}

			return new RegExp('^' + routeParts.join('\\/') + '$').test(path);
		});

		if (lookupRoute) {
			return lookupRoute;
		}

		// Return the fallback route if the path is not mapped to a registered route and a default route is set.
		if (this.fallbackRoute) {
			return this.fallbackRoute;
		}

		// Could not find a route matching the path.
		return null;
	}

	/**
	 * Set the route that should be rendered when navigating to the app base URL.
	 *
	 * @param name - The name of the route to set as default.
	 * 
	 * @returns Indicator if the route could be set as default.
	 */
	setDefault(name: string): boolean {

		const route = this._routes.find(r => r.name === name);

		if (route) {

			this._routes.forEach(r => r.isDefault = false);

			route.isDefault = true;

			return true;
		}

		return false;
	}

	/**
	 * Set the route that should be rendered when navigating to a route that does not exist.
	 *
	 * @param name - The name of the route to set as fallback.
	 * 
	 * @returns Indicator if the route could be set as fallback.
	 */
	setFallback(name: string): boolean {

		const route = this._routes.find(r => r.name === name);

		if (route) {

			this._routes.forEach(r => r.isFallback = false);

			route.isFallback = true;

			return true;
		}

		return false;
	}

	/**
	 * Navigate to the current browser URL path.
	 * 
	 * @returns Promise for the navigation result.
	 */
	async load(): Promise<void> {

		// Lookup the registered route for the path.
		const route = this.getRouteForPath(window.location.href);

		if (!route) {

			console.error(`[Router] No route registered for path '${window.location.href}', unable to navigate.`);

			return;
		}

		// Ensure that a router outlet attached itself to the router.
		if (!this.onNavigate) {

			console.warn(`[Router] No route rendering outlet attached yet, did you add a <omni-router> tag to your web page?`);

			return;
		}

		// Prevent navigating to a guarded route.
		if (route.guard && !(await route.guard())) {

			console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);

			return;
		}

		// Render the route that matches the browser URL path.
		await this._applyRoute(route);
	}

	/**
	 * Push a new path onto the browser history stack and render it's registered route.
	 *
	 * @param path - The path to route to, e.g. /todo/123
	 * @param state - Optional, meta data to attach to the path.
	 */
	async push(path: string, state = {}): Promise<void> {

		// Lookup the registered route for the path.
		const route = this.getRouteForPath(path);

		if (!route) {

			console.error(`[Router] No route registered for path '${path}', unable to navigate.`);

			return;
		}

		// Ensure that a router outlet attached itself to the router.
		if (!this.onNavigate) {

			console.warn(`[Router] No route rendering outlet attached yet, did you add a <omni-router> tag to your web page?`);

			return;
		}

		// Prevent navigating to a guarded route.
		if (route.guard && !(await route.guard())) {

			console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);

			return;
		}

		// Push the path onto the browser history stack.
		history.pushState(state, route.name, path);

		// Render the route that matches the browser URL path.
		await this._applyRoute(route);
	}

	/**
	 * Update the current path in the browser history stack with a new path and render it's registered route.
	 * 
	 * @param path - The path to navigate to, e.g. /todo/123
	 * @param state - Optional, meta data to attach to the path.
	 */
	async replace(path: string, state = {}): Promise<void> {

		// Lookup the registered route for the path.
		const route = this.getRouteForPath(path);

		if (!route) {

			console.error(`[Router] No route registered for path '${path}', unable to navigate.`);

			return;
		}

		// Ensure that a router outlet attached itself to the router.
		if (!this.onNavigate) {

			console.warn(`[Router] No route rendering outlet attached yet, did you add a <omni-router> tag to your web page?`);

			return;
		}

		// Prevent navigating to a guarded route.
		if (route.guard && !(await route.guard())) {

			console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);

			return;
		}

		// Replace the current path in the browser history stack.
		history.replaceState(state, route.name, path);

		// Render the route that matches the browser URL path.
		await this._applyRoute(route);
	}

	/**
	 * Pops the current path in the browser history stack and navigate the previous path.
	 */
	pop(): void {

		history.back();
	}

	// --------------
	// EVENT HANDLERS
	// --------------

	/**
	 * Render the registered route of the current browser URL when a browser navigation button was pressed or navigation API for the back, forward, and go actions was called.
	 */
	private async _onPopState(): Promise<void> {

		//
		// NOTE:
		//
		// In order to animate route out of view we need to play an inverse animation when the browser back button is
		// pressed or history.back() is invoked. Unfortunately, it is not possible to detect in pop-state if the user
		// click the browser back for forward button. Mostly it would be the back button, especially on mobile browser
		// if the hardware or OS-level back button was clicked. We thus here simply assume that back was pressed. In
		// future we could consider building an internal history management pattern, but this is not guaranteed and
		// would likely be a best effort patch.
		//

		// Determine if the back button navigation event was triggered.
		const backPressed = true;

		// Lookup the registered route for the path.
		const route = this.getRouteForPath(window.location.href);

		if (!route) {

			console.error(`[Router] No route registered for path '${window.location.href}', unable to navigate.`);

			return;
		}

		// Ensure that a router outlet attached itself to the router.
		if (!this.onNavigate) {

			console.warn(`[Router] No route rendering outlet attached yet, did you add a <omni-router> tag to your web page?`);

			return;
		}

		// Prevent navigating to a guarded route.
		if (route.guard && !(await route.guard())) {

			console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);

			return;
		}

		// Render the route that matches the browser URL path.
		await this._applyRoute(route, backPressed);
	}

	// ---------------
	// PRIVATE METHODS
	// ---------------

	/**
	 * Setup and animate in the given route.
	 * 
	 * @param route - The route to navigate to.
	 * @param animateOut - Set to animate out the current view using the opposite effect of how it was animated in.
	 */
	private async _applyRoute(route: Route, animateOut = false): Promise<void> {

		// Set the page title.
		if (route.title) {
			document.title = route.title;
		}

		// Keep record of the route history.
		this._previousLocation = this._currentLocation;

		// Build up the new route information.
		this._currentLocation = {
			href: window.location.href,
			protocol: window.location.protocol?.replace(':', ''),
			host: window.location.hostname,
			port: Number(window.location.port) || undefined,
			path: window.location.pathname,
			query: window.location.search?.replace('?', '') || undefined,
			hash: window.location.hash?.replace('#', '') || undefined,

			pathParams: this._getPathParams(window.location.pathname, route.path) || undefined,
			queryParams: Object.fromEntries(new URLSearchParams(window.location.search)) || undefined,

			route: route
		};

		// Calculate which animation to play when rendering in the new view.
		let animation: RouteAnimationIn | RouteAnimationOut | undefined;

		if (animateOut && this._previousLocation?.route?.animation) {

			// If the current route was animated in, then animate it 'out' while loading the new route.
			animation = `${this._previousLocation.route.animation}-out`;

		} else if (this._currentLocation.route?.animation) {

			// If the new route has an animation set, then animate it 'in' to view.
			animation = `${this._currentLocation.route?.animation}-in`;
		}

		// Request that the router outlet render the new route.
		if (this.onNavigate) {

			// Notify subscribers that the route has started loading.
			for (const listener of this._eventListeners['route-loading']) {

				listener({
					previous: this._previousLocation,
					current: this._currentLocation
				});
			}

			// Load the route.
			await this.onNavigate(this._currentLocation, animation);

			// Notify subscribers that the route has been loaded.
			for (const listener of this._eventListeners['route-loaded']) {

				listener({
					previous: this._previousLocation,
					current: this._currentLocation
				});
			}
		}
	}

	/**
	 * Get the path parameters for a given URL path and route pattern.
	 *
	 * @param path - The URL path to extract parameter values from.
	 * @param routePath - The route configuration path pattern to extract parameter names from.
	 * 
	 * @returns The path keys and values.
	 */
	private _getPathParams(path: string, routePath: string): object | null {

		const pathParts = path.split('/');
		const routeParts = routePath.split('/');

		// Convert the path to a key value pair object.
		const pathParams: {
			[key: string]: string | null
		} = {};

		for (let i = 0; i < routeParts.length; i++) {

			if (routeParts[i].startsWith(':')) {
				pathParams[routeParts[i].replace(':', '').replace('?', '')] = pathParts[i];
			}
		}

		// Ensure there are values in the result.
		if (Object.keys(pathParams).length === 0) {
			return null;
		}

		// Return the key value pairs.
		return pathParams;
	}
}

// Export a singleton instance of the router.
export const Router = new RouterImpl();