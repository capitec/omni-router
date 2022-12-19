<p align="center"><br><img src="https://raw.githubusercontent.com/capitec/omni-components/develop/eleventy/assets/images/logo.png" width="128" height="128"/></p>

<h3 align="center">Omni Router</h3>
<p align="center"><strong><code>@capitec/omni-router</code></strong></p>
<p align="center">Framework agnostic <!--and zero dependency -->client-side web component router</p>

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

Omni router lets you ...


## Introduction

...


## Installation

```bash
npm install @capitec/omni-router
```

## Usage

```js
import { Router } from '@capitec/omni-router';

const template = document.createElement('template');
template.innerHTML = `<omni-router-outlet></omni-router-outlet>`;

class MyApp extends HTMLElement {

	constructor() {

		super();

		// Create the element shadow root.
		const shadow = this.attachShadow({ mode: 'open' });

		// Set the element content.
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		// Register the app routes.
		const router = Router.getInstance();

		router.addRoute({
			name: 'view-login',
			title: 'Log In',
			path: '/login',
			animation: 'fade',
			load: () => import('views/ViewLogin'),
			isFallback: true
		});

		router.addRoute({
			name: 'view-register',
			title: 'Register',
			path: '/register',
			animation: 'fade',
			load: () => import('views/ViewRegister')
		});

		router.addRoute({
			name: 'view-home',
			title: 'Home',
			path: '/home',
			animation: 'fade',
			load: () => import('views/ViewHome'),
			guard: () => this.isAuthenticated()
		});
	}
}

customElements.define('my-app', MyApp);
```

### index.html

```html
<!DOCTYPE html>
<html lang="en">
	<head>
		<title>My App</title>
	</head>
	<body>
		<h2>Omni Router Demo</h2>
		<my-app></my-app>

		<!-- scripts -->
		<script src="my-app.js"></script> 
	</body>
</html>
```


## API Reference

Full API documentation available in [/docs](https://capitec.github.io/omni-router/modules.html).

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