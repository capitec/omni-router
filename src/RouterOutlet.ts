import { Router } from './Router.js';
import { RouteAnimationIn, RouteAnimationOut, RoutedLocation } from './types.js';

/**
 * An animation task to load a route with.
 */
type RouteTask = {

	/** The location to route to. */
	routedLocation: RoutedLocation;

	/** The animation to apply when routing. */
	animation?: RouteAnimationIn | RouteAnimationOut;
};

/**
 * A web component that acts as the bounding box within which a routed web component will render.
 *
 * Usage:
 * ```html
 *     <omni-router-outlet
 *         @navigation-started="${() => console.log(`Route '${route.name}' started to load`)}"
 *         @navigation-completed="${() => console.log(`Route '${route.name}' finished loading`)}">
 *     </omni-router-outlet>
 * ```
 */
export class RouterOutlet extends HTMLElement {

	/** The instance to the router singleton. */
	private _router: Router;

	/** The routed location that is currently loaded in the outlet. */
	private _currentLocation?: RoutedLocation;

	/** The routed location that was previously loaded in the outlet. */
	private _previousLocation?: RoutedLocation;

	/** Indicator if there is a routing animation currently playing. */
	private _isAnimating: boolean;

	/** List of queued navigation animation tasks. */
	private _animationQueue: RouteTask[] = [];

	// --------------
	// INITIALIZATION
	// --------------

	/**
	 * Initializes the component.
	 */
	constructor() {

		super();

		// Initialize default properties.
		this._router = Router.getInstance();
		this._isAnimating = false;

		// Create the element shadow root.
		const shadow = this.attachShadow({ mode: 'open' });

		// Set component styles.
		const style = document.createElement('style');
		style.textContent = `
			:host {
				width: 100%;
				height: 100%;
				overflow: hidden;

				position: relative;
			}

			.page {
				width: 100%;
				height: 100%;

				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				right: 0;
			}

			/** Fade In Animation */

			.fade-in {
				opacity: 0;
			}

			.fade-in.animate {
				animation: fadein var(--omni-router-animation-duration, 300ms) both;
				
				z-index: var(--omni-router-animation-z-index, 1000000);
			}

			@keyframes fadein {
				from {
					opacity: 0;
				}
				to {
					opacity: 1;
				}
			}

			/* Fade Out Animation */

			.fade-out {
				opacity: 1;
			}

			.fade-out.animate {
				animation: fadeout var(--omni-router-animation-duration, 300ms) both;

				z-index: var(--omni-router-animation-z-index, 1000000);
			}

			@keyframes fadeout {
				from {
					opacity: 1;
				}
				to {
					opacity: 0;
				}
			}

			/* Slide In Animation */

			.slide-in {
				transform: translateX(100%);
			}

			.slide-in.animate {
				animation: slidein var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0, 0, 0.2, 1);

				z-index: var(--omni-router-animation-z-index, 1000000);
			}

			@keyframes slidein {
				from {
					transform: translateX(100%);
				}
				to {
					transform: translateX(0px);
				}
			}

			/* Slide Out Animation */

			.slide-out {
				transform: translateX(0px);
			}

			.slide-out.animate {
				animation: slideout var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);

				z-index: var(--omni-router-animation-z-index, 1000000);
			}

			@keyframes slideout {
				from {
					transform: translateX(0px);
				}
				to {
					transform: translateX(100%);
				}
			}

			/* Pop In Animation */

			.pop-in {
				transform: translateY(100%);
			}

			.pop-in.animate {
				animation: popin var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0, 0, 0.2, 1);

				z-index: var(--omni-router-animation-z-index, 1000000);
			}

			@keyframes popin {
				from {
					transform: translateY(100%);
				}
				to {
					transform: translateY(0px);
				}
			}

			/* Pop Out Animation */

			.pop-out {
				transform: translateY(0px);
			}

			.pop-out.animate {
				animation: popout var(--omni-router-animation-duration, 300ms) both;
				animation-timing-function: cubic-bezier(0.4, 0, 0.6, 1);

				z-index: var(--omni-router-animation-z-index, 1000000);
			}

			@keyframes popout {
				from {
					transform: translateY(0px);
				}
				to {
					transform: translateY(100%);
				}
			}
		`;

		shadow.appendChild(style);
	}

	/**
	 * Setup the component once added to the DOM.
	 */
	connectedCallback(): void {

		// Set this outlet as the route rendering handler for the router.
		this._router.onNavigate = (route, animation): Promise<void> => this._loadRoute(route, animation);
	}

	/**
	 * Clean up the component once removed from the DOM.
	 */
	disconnectedCallback(): void {

		// Stop rendering on router navigation changes.
		this._router.onNavigate = undefined;
	}

	// ----------
	// PROPERTIES
	// ----------

	// n/a

	// --------------
	// PUBLIC METHODS
	// --------------

	// n/a

	// ---------------
	// PRIVATE METHODS
	// ---------------

	/**
	 * Load a route into view.
	 *
	 * Note:
	 * As route components are animated in, this function may be called while an previous route load animation
	 * is still playing. In such cases the task will be queued and completed after the first animation finishes.
	 *
	 * @param routedLocation - The the routed location to load.
	 * @param animation - The animation to play to bring the new route into view.
	 */
	private async _loadRoute(routedLocation: RoutedLocation, animation?: RouteAnimationIn | RouteAnimationOut): Promise<void> {

		// Ensure a valid route is provided.
		const route = routedLocation.route;

		if (!route) {
			return;
		}

		// Prevent loading the route if it is already in view.
		if (this._currentLocation?.route?.name === route.name) {
			return;
		}

		// Queue the route load task.
		this._animationQueue.push({
			routedLocation,
			animation
		});

		// Start processing the queue of route load tasks, if it is not running yet.
		if (!this._isAnimating) {
			await this._processNextQueueItem();
		}
	}

	/**
	 * Process the queue of route load tasks.
	 */
	private async _processNextQueueItem(): Promise<void> {

		// Remove the task next available from the queue.
		const routeRequest = this._animationQueue.shift();

		// Stop processing the queue if it is empty.
		if (!routeRequest) {

			// Mark the queue as done processing.
			this._isAnimating = false;

			return;
		}

		// Mark the queue as busy processing.
		this._isAnimating = true;

		// Get the routing task information.
		const routedLocation = routeRequest.routedLocation;
		const animation = routeRequest.animation;

		// Stop processing if the route provided is not vaild.
		const route = routedLocation.route;

		if (!route) {

			// Mark the queue as done processing.
			this._isAnimating = false;

			return;
		}

		// Record the old and new routing locations.
		this._previousLocation = this._currentLocation;
		this._currentLocation = routedLocation;

		// Notify any subscribers that the route has start to load.
		this.dispatchEvent(
			new CustomEvent('navigation-started', {
				detail: this._currentLocation,
				bubbles: true,
				composed: true
			})
		);

		// Load the route component if required.
		if (route.load) {
			await route.load();
		}

		// Add the page component to the router display.
		const oldRouteComponent = this._getCurrentRouteComponent();
		const newRouteComponent = document.createElement(route.name);

		newRouteComponent.classList.add('page');

		// Start a task to animate in the new route component and animate out the old route component.
		await new Promise<void>((resolve) => {

			if (animation === 'fade-in' || animation === 'slide-in' || animation === 'pop-in') {

				// Set the animation type the new route component should use to animate in.
				newRouteComponent.classList.add(animation);

				// Clean up the animation once done.
				newRouteComponent.addEventListener('animationend', () => {
					// Clear the animation from the element.
					newRouteComponent.classList.remove(animation, 'animate');

					// Remove the old route component from view.
					if (oldRouteComponent) {
						oldRouteComponent.remove();
					}

					// Mark the routing task as complete.
					resolve();
				});

				// Add the new route component to the top of the view stack so the the animation is visible.
				this.shadowRoot?.append(newRouteComponent);

				// Start the animation.
				setTimeout(() => {
					newRouteComponent.classList.add('animate'); // NOTE: the 10ms delay is needed on old browsers to prevent rendering the animation in the same cycle as the component is added to DOM.
				}, 10);

			} else if (animation === 'fade-out' || animation === 'slide-out' || animation === 'pop-out') {

				if (oldRouteComponent) {

					// Set the animation type the old route component should use to animate out.
					oldRouteComponent.classList.add(animation);

					// Clean up the animation once done.
					oldRouteComponent.addEventListener('animationend', () => {
						// Clear the animation from the element.
						oldRouteComponent.classList.remove(animation, 'animate');

						// Remove the old route component from view.
						oldRouteComponent.remove();

						// Mark the routing task as complete.
						resolve();
					});

					// Add the new route component to the bottom of the view stack so the the animation is visible.
					this.shadowRoot?.prepend(newRouteComponent);

					// Start the animation.
					setTimeout(() => {
						oldRouteComponent.classList.add('animate'); // NOTE: the 10ms delay is needed on old browsers to prevent rendering the animation in the same cycle as the component is added to DOM.
					}, 10);

				} else {

					// There is no old route component to animate out, just add the new route component instead.
					this.shadowRoot?.prepend(newRouteComponent);

					// Mark the routing task as complete.
					resolve();
				}

			} else {

				// No animation is set, just remove the old route component and add the new route component.
				if (oldRouteComponent) {
					oldRouteComponent.remove();
				}

				this.shadowRoot?.append(newRouteComponent);

				// Mark the routing task as complete.
				resolve();
			}
		});

		// Notify any subscribers that the route has finished loading.
		this.dispatchEvent(
			new CustomEvent('navigation-completed', {
				detail: this._currentLocation,
				bubbles: true,
				composed: true
			})
		);

		// Process the next task in the animation queue, if there is any.
		await this._processNextQueueItem();
	}

	/**
	 * Get the DOM element of the currently routed to page.
	 *
	 * @returns The routed page route element.
	 */
	private _getCurrentRouteComponent(): Element | null {

		if (!this.shadowRoot) {
			return null;
		}

		for (let i = 0; i < this.shadowRoot.children.length; i++) {

			const child = this.shadowRoot.children[i];

			if (child.tagName.toLowerCase() !== 'style') {
				return child;
			}
		}

		return null;
	}
}

customElements.define('omni-router', RouterOutlet);