import { LitElement, html, css, PropertyValueMap } from 'lit'
import { customElement, state, property } from 'lit/decorators.js';

import { Router } from '@capitec/omni-router';

@customElement('app-shell')
export class AppShell extends LitElement {

	private _router: Router;

	@state()
	private _lockActive: boolean = true;

	constructor() {

		super();

		// Set default property values.
		this._lockActive = true;

		// Connect application services.
		this._router = Router.getInstance();

		// Register the app routes.
		this._router.addRoute({
			name: 'view-fade',
			title: 'Fade',
			path: '/fade',
			animation: 'fade',
			load: () => import('./views/ViewFade'),
			isDefault: true
		});

		this._router.addRoute({
			name: 'view-slide',
			title: 'Slide',
			path: '/slide',
			animation: 'slide',
			load: () => import('./views/ViewSlide')
		});

		this._router.addRoute({
			name: 'view-pop',
			title: 'Pop',
			path: '/pop',
			animation: 'pop',
			load: () => import('./views/ViewPop')
		});

		this._router.addRoute({
			name: 'view-guarded',
			title: 'Guarded Route',
			path: '/guarded',
			load: () => import('./views/ViewGuarded'),
			guard: () => !this._isLocked()
		});

		this._router.addRoute({
			name: 'view-fallback',
			title: 'Fallback Route',
			path: '/error404',
			load: () => import('./views/ViewFallback'),
			isFallback: true
		});
	}

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {

		// Load the route matching the current browser path.
		this._router.load();
	}

	_navigate(path: string) {

		this._router.push(path);
	}

	static styles = css`
		:host {
			width: 100%;
			height: 100%;

			display: flex;
			flex-direction: column;
			justify-content: stretch;
			align-items: stretch;
		}

		/* Header */

		header {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;

			padding: 40px 20px;

			background-color: #FFFFFF;

			transition: all .5s linear;
		}

		header > img {
			width: 150px;

			transition: all .5s linear;
		}

		header > h1 {
			font-family: Arial, Helvetica, sans-serif;
			font-size: 32px;
			font-weight: bold;

			padding: 0px;
			margin: 20px 0px 0px 0px;

			transition: all .5s linear;
		}

		@media only screen and (max-width: 1000px) {
			header {
				padding: 20px;
			}

			header > img {
				width: 64px;
			}

			header > h1 {
				font-size: 24px;
			}
		}

		@media only screen and (max-height: 700px) {
			header {
				display: none;
			}
		}

		/* Nav Bar */

		nav {
			display: flex;
			flex-direction: row;
			align-items: stretch;
			justify-content: flex-start;

			background-color: #209dee;
			
			font-family: Arial, Helvetica, sans-serif;
			font-size: 16px;
			font-weight: normal;

			padding: 0px 20px;

			flex-shrink: 0;
			flex-wrap: wrap;

			transition: all .5s linear;
		}

		nav > a {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: flex-start;

			padding: 0px 20px;

			color: #FFFFFF;
			
			font-family: Arial, Helvetica, sans-serif;
			font-size: 16px;
			font-weight: normal;

			text-decoration: none;

			height: 64px;

			cursor: pointer;
		}

		nav > a:hover {
			background-color: #1b86cb;
		}

		nav > a .emoji {
			font-size: 24px;
			margin-right: 10px;
		}

		nav > a > small {
			font-weight: bold;
			margin-left: 5px;
			display: inline;
		}

		nav > a > small.locked {
			color: #f7bd6a;
		}

		nav > a > small.unlocked {
			color: #76fc78;
		}

		nav > a.push-right {
			margin-left: auto;
		}

		@media only screen and (max-width: 1000px) {
			nav {
				padding: 0px;
				justify-content: center;
			}

			nav > a {
				height: 48px;
			}

			nav > a.push-right {
				margin-left: 0px;
			}
		}

		/* Content Area */

		omni-router-outlet {
			flex: 1 1 auto;
		}
	`;

	render() {

		return html`
			<header>
				<img src="./assets/logo.png">
				<h1>Omni Router Demo</h1>
			</header>
			
			<nav>
				<a @click="${() => this._navigate('/')}"><span class="emoji">🏠</span>Default Route</a>
				<a @click="${() => this._navigate('/fade')}">Fade</a>
				<a @click="${() => this._navigate('/slide')}">Slide</a>
				<a @click="${() => this._navigate('/pop')}">Pop</a>
				<a @click="${() => this._navigate('/guarded')}">Guarded Route ${this._lockActive ? html`<small class="locked">[Locked]</small>` : html`<small class="unlocked">[Unlocked]</small>`}</a>
				<a @click="${() => this._navigate('/some-missing-path')}">Fallback Route</a>

				${this._lockActive ? html`
					<a id="login" class="push-right" @click="${() => this._unlock()}">Unlock Guard</a>
				`: html`
					<a id="logout" class="push-right" @click="${() => this._lock()}">Lock Guard</a>
				`}
			</nav >

			<omni-router></omni-router>
		`;
	}

	_unlock() {

		this._lockActive = false;

		this.requestUpdate();
	}

	_lock() {

		this._lockActive = true;

		this.requestUpdate();
	}

	_isLocked() {

		if (this._lockActive) {
			alert('Route locked. Unlock to navigate...');
		}

		return this._lockActive;
	}
}