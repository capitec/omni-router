<p align="center"><br><img src="./docs/logos/omni.png" width="128" height="128"/></p>

<h3 align="center">Omni Router</h3>
<p align="center"><strong><code>@capitec/omni-router</code></strong></p>
<p align="center">Framework agnostic, zero dependency, client-side web component router</p>

<br />

<p align="center">
	<a href="https://npmcharts.com/compare/@capitec/omni-router?minimal=true"><img alt="Downloads per week" src="https://img.shields.io/npm/dw/@capitec/omni-router.svg" height="20"/></a>
	<a href="https://www.npmjs.com/package/@capitec/omni-router"><img alt="NPM Version" src="https://img.shields.io/npm/v/@capitec/omni-router.svg" height="20"/></a>
	<a href="https://github.com/capitec/omni-router/actions/workflows/build.yml"><img alt="GitHub Build" src="https://github.com/capitec/omni-router/actions/workflows/build.yml/badge.svg" height="20"/></a>
	<a href="https://github.com/capitec/omni-router/blob/develop/LICENSE"><img alt="MIT License" src="https://img.shields.io/github/license/capitec/omni-router" height="20"/></a>
</p>
<p align="center">
	<a href="https://capitec.github.io/open-source/?repo=omni-router"><img alt="Docs" src="https://img.shields.io/static/v1?label=docs&message=capitec.github.io/open-source&color=blue&style=flat-square" /></a>
</p>
<!--
<p align="center">
	<a href="https://capitec.github.io/open-source/?repo=omni-router"><img alt="Docs" src="https://img.shields.io/static/v1?label=docs&message=opensource.capitecbank.co.za&color=blue&style=flat-square" /></a>
	<a href="https://twitter.com/capitecbank"><img src="https://img.shields.io/twitter/follow/capitecbank" /></a>
</p>
-->

<br/>

<p align="center">
	[<a href="#introduction">Introduction</a>]
	[<a href="#usage">Usage</a>]
	[<a href="#api-reference">API Reference</a>]
	[<a href="#contributors-">Contributors</a>]
	[<a href="#license">License</a>]
</p>

<br/>

---

## Introduction

Omni Router is a simple client-side page router for single page application (SPA) web component projects. The router is provided as a vanilla JavaScript web component, allowing it to be used easily in your preferred front-end framework. The library comes with zero dependencies, minimizing bloat to your project.

Core features of the library include:
- **Web Components** - The router has been specifically built to route pages built using web components.
- **Lazy Loading** - Web component pages can be lazy loaded using ```import('...')```.
- **Route Guards** - Routes can be protected using guard functions that prevent routing based on your app logic, e.g. check if the user is logged in.
- **Animations** - Pages can be animated in and out of view when routing, e.g. fade, slide, pop, etc.
- **Browser History** - Integrates with the browser history API to push, pop, and replace paths.
- **Mobile Friendly** - Navigating back reverses the route load animation, allowing mobile-like user experiences e.g. sliding routes in and out.

## Installation

```bash
npm install @capitec/omni-router
```

## Usage

Simply import the ```Router``` and add your page routes. Place the ```<omni-router>``` tag in your web page, all routes will be rendered in this container.

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">

		<title>Omni Router Demo</title>
		
		<base href="/">

		<script type="module">
			import { Router } from '@capitec/omni-router';

			// Iniitialize the router.
			const router = Router.getInstance();

			// Register the app routes.
			router.addRoute({
				name: 'view-fade',
				title: 'Fade',
				path: '/fade',
				animation: 'fade',
				load: () => import('./views/ViewFade'),
				isDefault: true
			});

			router.addRoute({
				name: 'view-slide',
				title: 'Slide',
				path: '/slide',
				animation: 'slide',
				load: () => import('./views/ViewSlide')
			});

			router.addRoute({
				name: 'view-pop',
				title: 'Pop',
				path: '/pop',
				animation: 'pop',
				load: () => import('./views/ViewPop')
			});

			router.addRoute({
				name: 'view-guarded',
				title: 'Guarded Route',
				path: '/guarded',
				load: () => import('./views/ViewGuarded'),
				guard: () => !this._isUserLoggedIn()
			});

			router.addRoute({
				name: 'view-fallback',
				title: 'Fallback Route',
				path: '/error404',
				load: () => import('./views/ViewFallback'),
				isFallback: true
			});

			// Load the route matching the current browser path.
			router.load();
		</script>

		<script type="module" src="./AppShell.js"></script>
	</head>

	<body>
		<omni-router></omni-router>
	</body>
</html>
```

Create your route page web components.

```js
// view/ViewFade.js

import { Router } from '@capitec/omni-router';

class ViewFade extends HTMLElement {

	constructor() {

		super();

		// Connect application services.
		this._router = Router.getInstance();

		// Create the DOM content template.
		const template = document.createElement('template');
		template.innerHTML = `
			<h1>Hello World</h1>
			<button id="back">⬅ Go Back</button>
		`;

		// Create a shadow root for the content.
		this.attachShadow({ mode: 'open' });

		// Add the template content to the shadow root.
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		// Register element event listeners.
		this.shadowRoot.querySelector('#back').addEventListener('click', () => this._router.pop());
	}
}

customElements.define('view-fade', ViewFade);
```
## Example Projects

Starter projects are available in the [examples directory](./examples) for the following frameworks:

<div align="center">
	<table>
		<tbody>
			<tr>
				<td align="center">
					<a href="./examples/vanilla">
						<img src="./docs/logos/javascript.png" width="128" height="128" alt="Vanilla JS" />
						<br />
						<sub><b>Vanilla JS</b></sub>
					</a>
				</td>
				<td align="center">
					<a href="./examples/lit">
						<img src="./docs/logos/lit.png" width="128" height="128" alt="Lit" />
						<br />
						<p><b>Lit</b><br><sub>(coming soon)</sub</p>
					</a>
				</td>
				<td align="center">
					<a href="./examples/angular">
						<img src="./docs/logos/angular.png" width="128" height="128" alt="Lit" />
						<br />
						<p><b>Angular</b><br><sub>(coming soon)</sub</p>
					</a>
				</td>
				<td align="center">
					<a href="./examples/vue">
						<img src="./docs/logos/vue.png" width="128" height="128" alt="Lit" />
						<br />
						<p><b>Vue</b><br><sub>(coming soon)</sub</p>
					</a>
				</td>
				<td align="center">
					<a href="./examples/react">
						<img src="./docs/logos/react.png" width="128" height="128" alt="Lit" />
						<br />
						<p><b>React</b><br><sub>(coming soon)</sub</p>
					</a>
				</td>
			</tr>
		</tbody>
	</table>
</div>

## API Reference

### Route Object

The ```Route``` object contains the following properties:

| Property | Type | Description |
| -------- | ---- | ----------- |
| **name** | string | The registered custom-element tag name for your page web component, e.g. ```'view-login'``` |
| **title** | string | The window title to show when the route is loaded, e.g. ```'Login'``` |
| **animation** | string | Optional, animation to apply when loading the route. Can be one of ```fade```, ```slide```, ```pop```
| **load** | function | Optional, function to execute before navigating to the route. Typically used to lazy load the page web component, e.g. <br>```() => import('./views/ViewLogin')``` |
| **load** | function | Optional, function to execute to check if a route may be navigated to. Typically used to limit access to routes., e.g. <br>```() => !this._isUserLoggedIn()``` |
| **isDefault** | boolean | Optional, flag to set this route as the default route to load when the browser URL path is empty or default, e.g. ```/```. Note: can only be applied to 1 route. |
| **isFallback** | boolean | Optional, flag to set this route as the fallback route to load when the user attempts to navigate to a route that does not exist, e.g. a 404 page. Note: can only be applied to 1 route. |

### Path Patterns

The router supports URL paths for the following patterns:

| Pattern | Example | Matches | Description |
| ------- | ------- | ------- | ----------- |
| **/part** | /hello/world | /hello/world | A static path part, will be matched exactly. |
| **/:param** | /hello/:place | /hello/world | A required path parameter. |
| **/:param?** | /hello/:place? | /hello<br>/hello/world | An optional path parameter |

> Note: Path part parameters must be valid URL characters including: Period(.), Dash(-), Characters(a-Z), Numbers(0-9).

### Styling

The router styling can be customized using the following CSS Custom Properties:

| CSS Variable | Default Value | Description |
| ------------ | ------------- | ----------- |
| ```--omni-router-animation-duration``` | ```300ms``` | The duration it takes for route pages to be animated into view. |
| ```--omni-router-page-background``` | ```#FFFFFF``` | The background color applied to all pages. May be transparent, however this may make animations look weird. |

### Base URL

To enable single page routing without causing the browser to reload, ensure a base path is specified in your ```index.html```, typically:
```html
<base href="/">
```

### Router Tag

The ```<omni-router>``` tag dispatches the following events, that may be useful to subscribe to when wanting to apply changes to a page while a route is lazy loading, e.g. show a loading indicator.

| Event | Description |
| ----- | ----------- |
| navigation-started | Fired before the route starts navigating, e.g. after ```guard``` is successful, but before ```load``` is called. |
| navigation-started | Fired after the route page has completely rendered on screen, e.g. after it was fully animated in. |

### Router Class

Full API documentation available in [/docs](https://capitec.github.io/omni-router/modules.html).

The ```Router``` class provides the following properties and functions:

| Property | Description |
| -------- | ----------- |
| ```get currentLocation(): RoutedLocation \| undefined``` | Get the currently location routed to. |
| ```get previousLocation(): RoutedLocation \| undefined``` |  Get the previous location routed to. |
| ```get defaultRoute(): Route \| undefined ``` | Get the route that should be rendered when navigating to the app base URL. |
| ```get fallbackRoute(): Route \| undefined``` | Get the route that should be rendered when navigating to a route that does not exist. |

| Function | Description |
| -------- | ----------- |
| ```addEventListener(eventName: RouterEventType, callback: () => void): void``` | Registers a callback function to be invoked when the router dispatches an event. |
| ```removeEventListener(eventName: RouterEventType, callback: () => void): void``` | Removes a callback function from the list of functions to be invoked when the router dispatches an event. |
| ```addRoute(route: Route): void``` | Register a new navigable routes. |
| ```getRouteForPath(pathOrUrl: string): Route \| null``` | Get the registered route for the given path. |
| ```setDefault(name: string): boolean``` | Set the route that should be rendered when navigating to the app base URL. |
| ```setFallback(name: string): boolean``` | Set the route that should be rendered when navigating to a route that does not exist. |
| ```load(): Promise\<void\>``` | Navigate to the current browser URL path. |
| ```push(path: string, state = {}): Promise\<void\>``` | Push a new path onto the browser history stack and render it's registered route. |
| ```replace(path: string, state = {}): Promise\<void\>``` | Update the current path in the browser history stack with a new path and render it's registered route. |
| ```pop(): void``` | Pops the current path in the browser history stack and navigate the previous path. |


## Contributors

Made possible by these fantastic people. 💖

See the [`CONTRIBUTING.md`](./CONTRIBUTING.md) guide to get involved.

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/jn42lm1"><img src="https://avatars2.githubusercontent.com/u/54233338?v=4?s=100" width="100px;" alt="jn42lm1"/><br /><sub><b>jn42lm1</b></sub></a><br /><a href="https://github.com/capitec/omni-router/commits?author=jn42lm1" title="Code">💻</a> <a href="https://github.com/capitec/omni-router/commits?author=jn42lm1" title="Documentation">📖</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

Licensed under [MIT](LICENSE)