import { Router } from '@capitec/omni-router';

class ViewLogin extends HTMLElement {

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
					/* Document this as a requirement for all views. */
					
					width: 100%;
					height: 100%;

					position: absolute;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;

					background-color: white;
				}
			</style>

			<h1>Login</h1>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

			<button id="back">Back</button>
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

customElements.define('view-login', ViewLogin);