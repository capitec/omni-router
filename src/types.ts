// --------------
// INTERNAL TYPES
// --------------

/**
 * The list of possible appear 'in' animation types.
 */
export type RouteAnimationIn = 'fade-in' | 'slide-in' | 'pop-in';

/**
 * The list of possible disappear 'out' animation types.
 */
export type RouteAnimationOut = 'fade-out' | 'slide-out' | 'pop-out';

// ------------
// PUBLIC TYPES
// ------------

/**
 * The animation to load a page in with when routing.
 */
export type RouteAnimation = 'fade' | 'slide' | 'pop';

/**
 * List of events dispatched by the router.
 */
export type RouterEventType = 'route-loading' | 'route-loaded';

/**
 * The callback function invoked when a route is loaded.
 */
export type RouterEventCallback = (detail: { previous?: RoutedLocation, current: RoutedLocation }) => void;

/**
 * A navigable route configuration.
 */
export type Route = {

	/** The unique identifier for the route, must be the tag name of the web component if tag is not set. */
	name: string;

	/** The tag name of the web component to render for this route. */
	tag?: string;

	/** The relative URL path for the route to set in the browser navigation bar. */
	path: string;

	/** The window title to set when the route is loaded. */
	title?: string;

	/** The effect to animate the route into and out of view with, e.g. fade, slide, pop. */
	animation?: RouteAnimation;

	/** CSS classname to attach to the route page when loading, useful to apply page level theme variables. */
	theme?: string;

	/** Optional metadata to store on the route. */
	metadata?: Record<string, unknown>;

	/** Indicator if the route template should be cached and reused, or recreated every time the route is navigated to. */
	cache?: boolean;

	/** Function to execute that lazy loads the web component. */
	load?: () => Promise<unknown>;

	/** Function to execute to determine if the view is allowed to be loaded. */
	guard?: () => boolean | Promise<boolean>;

	/** Set to load this route if the base URL of the web app is loaded. */
	isDefault?: boolean;

	/** Set to load this route by if no route is loaded. */
	isFallback?: boolean;
};

/**
 * The routed location information.
 */
export type RoutedLocation = {

	/** The full browser URL, e.g.http://localhost:3000/todos/1234?foo=bar#hello */
	href: string;

	/** The URL protocol part, e.g. "http" */
	protocol: string;

	/** The URL host part, e.g. "localhost" */
	host: string;

	/** The URL port part, e.g. 3000 */
	port?: number;

	/** The URL path part, e.g. "/todos/1234" */
	path?: string;

	/** The URL query string part, e.g. "?foo=bar" */
	query?: string;

	/** The URL anchor tag part, e.g. "hello" */
	hash?: string;

	/** The URL path part as a key value pairs, e.g. \{ id: 1234 \} */
	pathParams?: object;

	/** The URL query string part as a key value pairs, e.g. \{ foo: "bar" \} */
	queryParams?: object;

	/** The route configuration that matches the location. */
	route?: Route;
};