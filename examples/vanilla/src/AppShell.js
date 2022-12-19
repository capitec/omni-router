import { Router, RouterOutlet } from '@capitec/omni-router';

class AppShell extends HTMLElement {

	constructor() {

		super();

		// Create the element DOM content.
		this._createDOM();

		// Connect application services.
		this._router = Router.getInstance();

		// Register the app routes.
		this._router.addRoute({
			name: 'view-login',
			title: 'Log In',
			path: '/login',
			animation: 'fade',
			load: () => import('./views/ViewLogin'),
			isDefault: true
		});

		this._router.addRoute({
			name: 'view-register',
			title: 'Register',
			path: '/register',
			animation: 'slide',
			load: () => import('./views/ViewRegister')
		});

		this._router.addRoute({
			name: 'view-home',
			title: 'Home',
			path: '/home',
			animation: 'pop',
			load: () => import('./views/ViewHome'),
			guard: () => this._isAuthenticated()
		});

		this._router.addRoute({
			name: 'view-page-not-found',
			title: 'Page Not Found',
			path: '/error404',
			load: () => import('./views/ViewPageNotFound'),
			isFallback: true
		});

		// Load the route matching the current browser path.
		this._router.load();
	}

	_createDOM() {

		// Create the DOM content template.
		const template = document.createElement('template');
		template.innerHTML = `
			<style>
				:host {
					width: 100%;
					height: 100%;

					display: flex;
					flex-direction: column;
					justify-content: stretch;
					align-items: stretch;
				}

				.hidden {
					display: none;
				}

				header {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: flex-start;

					background-color: cornflowerblue;

					font-family: Arial, Helvetica, sans-serif;
					font-size: 16px;
					font-weight: bold;

					padding: 10px 20px;

					text-align: center;
				}

				header > button {
					margin-left: auto;

					padding: 10px 20px;

					border-radius: 6px;

					background-color: #FFFFFFCC;

					border: 1px solid grey;
				}

				nav {
					display: flex;
					flex-direction: row;
					align-items: center;
					justify-content: center;

					background-color: lightgrey;

					padding: 10px 20px;
				}

				nav > a {
					padding: 10px;
				}

				omni-router-outlet {
					flex: 1 1 auto;

					position: relative; /* move to RouterOutlet.js */
				}
			</style>

			<header>
				<h1>My App</h1>
				<button id="login">Login</button>
				<button id="logout" class="hidden">Logout</button>
			</header>

			<nav>
				<a href="/login">Login</a>
				<a href="/register">Register</a>
				<a href="/home">Home</a>
			</nav>
			
			<omni-router-outlet></omni-router-outlet>
		`;

		// Create a shadow root for the content.
		this.attachShadow({ mode: 'open' });

		// Add the template content to the shadow root.
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		// Register element event listeners.
		this.shadowRoot.querySelector('#login').addEventListener('click', () => this._login());
		this.shadowRoot.querySelector('#logout').addEventListener('click', () => this._logout());

		this.shadowRoot.querySelectorAll("a").forEach(link => {

			const path = link.getAttribute("href");

			link.onclick = e => {

				e.preventDefault();
				this._router.push(path);
			};
		});
	}

	_login() {

		this.shadowRoot.querySelector('#login').classList.add('hidden');
		this.shadowRoot.querySelector('#logout').classList.remove('hidden');

		this._userInfo = { name: 'Test User' };
	}

	_logout() {

		this.shadowRoot.querySelector('#login').classList.remove('hidden');
		this.shadowRoot.querySelector('#logout').classList.add('hidden');

		this._userInfo = null;
	}

	_isAuthenticated() {

		if (this._userInfo) {
			return true;
		}

		return false;
	}
}

customElements.define('app-shell', AppShell);