import { LitElement, html, property, customElement } from 'lit-element';

declare var acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();

@customElement('simple-greeting')
export class SimpleGreeting extends LitElement {
  @property() serviceWorkers = [];

  firstUpdated() {
    window.onload = () => {
      vscode.postMessage({
        name: 'Ready!!!!!!'
      });
    };

    window.addEventListener('message', (event) => {
      this.serviceWorkers = event.data.data;
      const serviceworker$ = this.serviceWorkers[0].id;
      console.log(serviceworker$);
    });
  }

  render() {
    return html`
      ${this.serviceWorkers.map((i) => html`<div class="serviceWorkerType"><input type="radio"  name="swgroup" value="${i.id}" id="selectsw${i.id}"><div class="swTypeInnerDiv"><h4>${i.title}</h4><span> ${i.description}</span></div></div></br> `)}
    `;
  }
}