import { LitElement, html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js';

import { Router } from '@capitec/omni-router';

@customElement('view-slide')
export class ViewSlide extends LitElement {

	private _router: Router;

	constructor() {

		super();

		// Connect application services.
		this._router = Router.getInstance();
	}

	static styles = css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			overflow: auto;

			box-sizing: border-box;
			padding: 20px;

			--omni-router-page-background: #eeffee;
		}

		@media only screen and (max-height: 720px) {
			:host {
				justify-content: flex-start;
			}
		}

		.logo {
			font-size: 128px;
		}

		h1 {
			margin: 20px 0px;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 32px;
			font-weight: bold;
		}

		p {
			margin: 20px 0px;

			font-family: Arial, Helvetica, sans-serif;
			font-size: 16px;
			font-weight: normal;

			text-align: center;
		}

		p:last-of-type {
			margin-top: 0px;
		}

		button {
			margin: 20px 0px;
			padding: 20px;

			border: none;
			border-radius: 10px;
			box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

			background-color: #ffffff;
		}
	`;

	render() {

		return html`
			<div class="logo">⛳</div>

			<h1>Slide</h1>
			
			<p>👋 Hey there, I animated into view with a <strong>slide</strong> animation!</p>
			<p>If you press back here or go back via the browser history, I'll <strong>slide</strong> out.</p>

			<button id="back">⬅ Go Back</button>
		`;
	}

	_navigateBack() {

		this._router.pop();
	}
}