import { Router } from '@capitec/omni-router';

class ViewGuarded extends HTMLElement {

	constructor() {

		super();

		// Connect application services.
		this._router = Router.getInstance();

		// Create the element DOM content.
		this._createDOM();
	}

	_createDOM() {

		// Create the DOM content template.
		const template = document.createElement('template');
		template.innerHTML = `
			<style>
				:host {
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;

					overflow: auto;

					box-sizing: border-box;
					padding: 20px;

					background-color: #eeffff;
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
				}

				button {
					margin: 20px 0px;
					padding: 20px;

					border: none;
					border-radius: 10px;
					box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px, rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;

					background-color: #ffffff;
				}
			</style>

			<div class="logo">🎯</div>

			<h1>Guarded Route</h1>
			
			<p>👋 Hey there, I'm protected by a guard function.</p>

			<button id="back">⬅ Go Back</button>
		`;

		// Create a shadow root for the content.
		this.attachShadow({ mode: 'open' });

		// Add the template content to the shadow root.
		this.shadowRoot.appendChild(template.content.cloneNode(true));

		// Register element event listeners.
		this.shadowRoot.querySelector('#back').addEventListener('click', () => this._navigateBack());
	}

	_navigateBack() {

		this._router.pop();
	}
}

customElements.define('view-guarded', ViewGuarded);