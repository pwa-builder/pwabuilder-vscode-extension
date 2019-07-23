import { LitElement, html, property, customElement } from 'lit-element';

declare var acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  @property() name = 'World';

  firstUpdated() {
    window.onload = () => {
      vscode.postMessage({
        name: 'Ready!!!!!!'
      });
    };
  }

  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}