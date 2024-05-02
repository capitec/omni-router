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

	/** The history of paths routed to. */
	private _pathStack: string[] = [];

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

	/** Indicator if the router should log out debug messages. */
	DEBUG = false;

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
	 * Get the list of paths routed to.
	 * 
	 * NOTE: this is an in memory list that can get out of sync with the browser history API when the user refreshes the page manually. Unfortunately there is no way
	 * to read the browser history. The Navigation API looks promising, but is only available currently from Chrome 102, and not at all on Firefox or Safari.
	 *
	 * @readonly
	 * 
	 * @returns The routed location information.
	 */
	get history(): string[] {

		return this._pathStack;
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

		// Default the route tag to the route name if not set, for backwards compatibility.
		// NOTE: prior to version 0.2.x - name represented the tag name, in 0.2.0 this was split into a name (unique ID) and tag (tag name) property instead.
		if (!route.tag) {
			route.tag = route.name;
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

		// No routes setup, return without further processing.
		if (this._routes.length === 0) {
			return null;
		}

		// Extract the path part from the given URL.
		let path = this._getPathString(pathOrUrl);

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
					routeParts[i] = '?[a-zA-Z0-9-_~()<>.\\s]*';
				} else if (routeParts[i].startsWith(':')) {
					routeParts[i] = '[a-zA-Z0-9-_~()<>.\\s]+';
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
	 * @returns True if the routing event occurred, or false when it is blocked, e.g. due to a guard condition.
	 */
	async load(): Promise<boolean> {

		const path = this._getPathString(window.location.href);
		const debugMessage = `path: ${path}`;

		// Report the debug event, if enabled.
		this._reportDebug('load.start', debugMessage);

		// Check if routing to the path is allowed.
		const route = await this._checkRoutingAllowed(path);

		if (!route) {

			this._reportDebug('load.blocked', debugMessage);

			return false;
		}

		// Add the path to the local history stack, if we are not already routed to the current path.
		if (this._pathStack.length === 0 || this._pathStack[this._pathStack.length - 1] !== path) {
			this._pathStack.push(path);
		}

		// Render the route that matches the browser URL path.
		await this._applyRoute(route);

		// Report the debug event, if enabled.
		this._reportDebug('load.end', debugMessage);

		// All good, mark the routing event as complete.
		return true;
	}

	/**
	 * Push a new path onto the browser history stack and render it's registered route.
	 * 
	 * The new path will be animated 'in' over the current path.
	 *
	 * @param path - The path to route to, e.g. /todo/123
	 * @param state - Optional, meta data to attach to the path.
	 * @param animateOut - Set to reverse the animation direction, making the current path animate 'out' to reveal the new path.
	 * 
	 * @returns True if the routing event occurred, or false when it is blocked, e.g. due to a guard condition.
	 */
	async push(path: string, state = {}, animateOut = false): Promise<boolean> {

		const debugMessage = `path: ${path}, animateOut: ${animateOut ? 'true' : 'false'}`;

		// Report the debug event, if enabled.
		this._reportDebug('push.start', debugMessage);

		// Check if routing to the path is allowed.
		const route = await this._checkRoutingAllowed(path);

		if (!route) {

			this._reportDebug('push.blocked', debugMessage);

			return false;
		}

		// Push the path onto the browser history stack.
		window.history.pushState(state, route.name, path);

		// Add the path to the local history stack.
		this._pathStack.push(path);

		// Render the route that matches the browser URL path.
		await this._applyRoute(route, animateOut, false);

		// Report the debug event, if enabled.
		this._reportDebug('push.end', debugMessage);

		// All good, mark the routing event as complete.
		return true;
	}

	/**
	 * Update the current path in the browser history stack with a new path and render it's registered route.
	 * 
	 * The new path will be animated 'in' over the current path.
	 * 
	 * @param path - The path to navigate to, e.g. /todo/123
	 * @param state - Optional, meta data to attach to the path.
	 * @param animateOut - Set to reverse the animation direction, making the current path animate 'out' to reveal the new path.
	 * 
	 * @returns True if the routing event occurred, or false when it is blocked, e.g. due to a guard condition.
	 */
	async replace(path: string, state = {}, animateOut = false): Promise<boolean> {

		const debugMessage = `path: ${path}, animateOut: ${animateOut ? 'true' : 'false'}`;

		// Report the debug event, if enabled.
		this._reportDebug('replace.start', debugMessage);

		// Check if routing to the path is allowed.
		const route = await this._checkRoutingAllowed(path);

		if (!route) {

			this._reportDebug('replace.blocked', debugMessage);

			return false;
		}

		// Replace the current path in the browser history stack.
		window.history.replaceState(state, route.name, path);

		// Replace the last path in the local history stack.
		this._pathStack[this._pathStack.length - 1] = path;

		// Render the route that matches the browser URL path.
		await this._applyRoute(route, animateOut, true);

		// Report the debug event, if enabled.
		this._reportDebug('replace.end', debugMessage);

		// All good, mark the routing event as complete.
		return true;
	}

	/**
	 * Pops the current path in the browser history stack and navigate the previous path.
	 * 
	 * The current path will be animated 'out' to reveal the previous path.
	 * 
	 * @param delta - The number of pages to go back. Must be a positive number. Defaults to 1 if not set.
	 */
	pop(delta?: number): Promise<boolean> {

		return new Promise((resolve) => {

			// Report the debug event, if enabled.
			this._reportDebug('pop.start', `delta: ${delta ?? 'n/a'}`);

			// If delta is not provided, or the delta is negative, then default to 1.
			if (!delta || delta <= 0) {
				delta = 1;
			}

			// Register an event listener to resolve the function when the pop event is detected.
			let timeoutId: number = 0;

			const waitForPop = async (): Promise<void> => {

				// Clear the automatic resolver timeout.
				window.clearTimeout(timeoutId);

				// Remote the pop event listener.
				window.removeEventListener('popstate', waitForPop); // eslint-disable-line @typescript-eslint/no-misused-promises

				// Check if routing to the path is allowed.
				const route = await this._checkRoutingAllowed(this._getPathString(window.location.href));

				// Resolve the promise with a status indicating if the routing event occurred.
				if (!route) {
					resolve(false);
				} else {
					resolve(true);
				}
			};

			window.addEventListener('popstate', waitForPop); // eslint-disable-line @typescript-eslint/no-misused-promises

			// Automatically resolve the function if the pop event has not occurred within 1 second. This prevents event listener registrations from building up.
			timeoutId = window.setTimeout(() => waitForPop(), 1000);

			// Navigate back the delta amount of pages.
			window.history.go(delta * -1);
		});
	}

	/**
	 * Pop all of the paths prior to the provided path off the browser history stack and render it's registered route.
	 * 
	 * The current path will be animated 'out' to reveal the previous path.
	 * 
	 * NOTE: if the path does not exist in the browser history stack, then it will be pushed onto the stack.
	 * 
	 * @param path - The path to navigate to, e.g. /todo/123
	 * @param before - If true, the path before the provided path in the stack will be popped to instead.
	 * 
	 * @returns Nothing.
	 */
	async popToPath(path: string, before = false): Promise<boolean> {

		// Report the debug event, if enabled.
		this._reportDebug('popToPath.start', `path: ${path}, before: ${before ? 'true' : 'false'}`);

		// Get the index of the path in the stack.
		const lastIndex = this._pathStack.lastIndexOf(path);

		// If the path does not exist on the stack, then route to the page by pushing it onto the router.
		if (lastIndex === -1) {
			return this.push(path, true);
		}

		// Otherwise, navigate back a delta amount of pages to get back to the path.
		const delta = (this._pathStack.length - 1 - lastIndex + (before ? 1 : 0));

		if (delta === 0) {
			return false;
		}

		return this.pop(delta);
	}

	// --------------
	// EVENT HANDLERS
	// --------------

	/**
	 * Render the registered route of the current browser URL when a browser navigation button was pressed or navigation API for the back, forward, and go actions was called.
	 */
	private async _onPopState(): Promise<void> {

		// Report the debug event, if enabled.
		this._reportDebug('_onPopState.start');

		// If the router has no routes, abort further processing.
		if (this._routes.length === 0) {
			return;
		}

		// Check if routing to the path is allowed.
		const path = this._getPathString(window.location.href);
		const route = await this._checkRoutingAllowed(path);

		if (!route) {
			return;
		}

		// Determine if the back button navigation event was triggered.
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
		const backPressed = true;

		// Remove all paths after the current path from the local history stack, if found.
		const lastIndex = this._pathStack.lastIndexOf(path);

		if (lastIndex !== -1) {
			this._pathStack.splice(lastIndex + 1);
		}

		// Render the route that matches the browser URL path.
		await this._applyRoute(route, backPressed);

		// Report the debug event, if enabled.
		this._reportDebug('_onPopState.end');
	}

	// ---------------
	// PRIVATE METHODS
	// ---------------

	/**
	 * Report a debug message to the console if debugging is enabled.
	 * 
	 * @param tag - The tag of the code location reporting the message.
	 * @param message - The message to display.
	 */
	private _reportDebug(tag: string, message?: string): void {

		// Ignore the request if debugging is not enabled.
		if (!this.DEBUG) {
			return;
		}

		// Log the debug message to the console.
		console.debug(`[Router] ${tag}${message ? ` -> ${message}` : ''}`, this._pathStack);
	}

	/**
	 * Check if routing to given path is allowed, executing the path route guard condition if needed.
	 * 
	 * @param path - The path to navigate to, e.g. /todo/123
	 * 
	 * @returns The route linked to the path, or undefined if routing is not allowed.
	 */
	private async _checkRoutingAllowed(path: string): Promise<Route | undefined> {

		// Check if routing to the path is allowed.
		const route = this.getRouteForPath(path);

		// Ensure that the route is valid.
		if (!route) {

			console.error(`[Router] No route registered for path '${path}', unable to navigate.`);

			return undefined;
		}

		// Ensure that a router outlet attached itself to the router.
		if (!this.onNavigate) {

			console.warn(`[Router] No route rendering outlet attached yet, did you add a <omni-router> tag to your web page?`);

			return undefined;
		}

		// Prevent navigating to a guarded route.
		if (route.guard && !(await route.guard())) {

			console.warn(`[Router] Route "${route.name}" stopped by its guard function, unable to navigate.`);

			return undefined;
		}

		return route;
	}

	/**
	 * Setup and animate in the given route.
	 * 
	 * @param route - The route to navigate to.
	 * @param animateOut - Set to animate out the current view using the opposite effect of how it was animated in.
	 * @param isReplace - Set to prevent updating previousLocation for replaces as per the native history api.
	 */
	private async _applyRoute(route: Route, animateOut = false, isReplace = false): Promise<void> {

		// Set the page title.
		if (route.title) {
			document.title = route.title;
		}

		if (!isReplace) {
			// Keep record of the route history.
			this._previousLocation = this._currentLocation;
		}

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

	/**
	 * Get the full path and URL parameters string for a given path, removing the protocol, server, and port information.
	 * 
	 * @param source - The URL to inspect.
	 * 
	 * @returns The path string.
	 */
	private _getPathString(source: string): string {

		return source.replace(window.location.origin, '');
	}
}

// Export a singleton instance of the router.
export const Router = new RouterImpl();
