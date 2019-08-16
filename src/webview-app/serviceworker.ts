import { css, LitElement, html, property, customElement } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html';

import Prism from 'prismjs';


@customElement('sw-picker')
export class SWPicker extends LitElement {
  @property() serviceWorkers = [];
  @property() currentServiceWorker = null;
  @property() webSiteData = 'Loading code...';
  @property() serviceWorkerCode = 'Loading code...';
  @property() highlightedWebSiteData = '';
  @property() highlightedSWCode = '';

  static get styles() {
    return css`
    @import url("http://prismjs.com/themes/prism-tomorrow.css");
    
      main {
        display: flex;
      }

      .column {
        float: left;    
        width: 40%;
        padding: 20px;
        flex: 1;
      }

      .column #topRow, .column #bottomRow {
        box-shadow: -1px 0px 13px 7px #252424;
        border-radius: 10px;
        padding-top: 8px;
        padding-left: 16px;
        padding-right: 16px;
        margin-bottom: 4em;
        min-height: 460px;
      }

      #leftColumn {
        margin-right: 4em;
      }

      .row1 {
        float: top;
        height: 50%;
      }

      .row2 {
        float: bottom;
        height: 50%;
      }

      .serviceWorkerType {
        display: flex;
        align-items: center;
        padding-left: 12px;
        padding-bottom: 14px;
        padding-right: 12px;
        cursor: pointer;
      }

      .serviceWorkerType#selected {
        border-radius: 12px;
        background: grey;
      }

      #buttonDiv {
        display: flex;
        justify-content: flex-end;
      }

      #buttonDiv #download {
        margin-right: 10px;
        background: linear-gradient(90deg,#1fc2c8,#9337d8 116%);
        color: white;
        border: none;
        padding: 1em;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 24px;
        font-weight: bold;
      }

      #buttonDiv #preview {
        background: grey;
        color: white;
        border: none;
        font-weight: bold;
        padding: 1em;
        padding-left: 20px;
        padding-right: 20px;
        border-radius: 24px;
      }

      #buttonDiv button:hover {
        cursor: pointer;
      }

      ul {
        padding: 0;
      }

      code {
        white-space: pre-wrap;
      }

      button {
        outline: none;
      }
    `;
  }

  firstUpdated() {
    console.log((window as any).vscode);
    
    (window as any).vscode.postMessage({
      name: 'Ready!!!!!!'
    });


    window.addEventListener('message', async (event) => {
      this.serviceWorkers = event.data.data;
      this.currentServiceWorker = this.serviceWorkers[0].id;

      console.log(this.currentServiceWorker);

      await this.getCode();

    });
  }

  async getCode() {
    const response = await fetch(`https://pwabuilder-api-prod.azurewebsites.net/serviceworkers/previewcode?ids=${this.currentServiceWorker}`);
    const data = await response.json();

    this.webSiteData = data.webSite;
    this.serviceWorkerCode = data.serviceWorker;
    this.highlightedWebSiteData = Prism.highlight(this.webSiteData, Prism.languages.javascript, 'javascript');
    this.highlightedSWCode = Prism.highlight(this.serviceWorkerCode, Prism.languages.javascript, 'javascript');
  }

  async updateChoice(id) {
    console.log(id);
    this.currentServiceWorker = id;
    await this.getCode();
  }

  download() {
    (window as any).vscode.postMessage({
      name: 'download',
      serviceWorkerId: this.currentServiceWorker,
      type: 'download'
    });
  }

  inspect() {
    (window as any).vscode.postMessage({
      name: 'sw',
      serviceWorkerId: this.currentServiceWorker,
      type: 'preview'
    });
  }


  render() {
    return html`

    <main>
      <div class="column" id="leftColumn">
        <h2>Choose a Service Worker</h2>
    
        <div id="serviceWorkerList">
          <h3> Service workers can make your site work offline, run faster, or both. Choose the functionality from our
            service workers below.</h3>
    
          <ul>
            ${this.serviceWorkers.map((i) => html`<li id=${i.id === this.currentServiceWorker ? 'selected' : null}  @click=${() => this.updateChoice(i.id)} class="serviceWorkerType"><div class="swTypeInnerDiv"><h4>${i.title}</h4><span> ${i.description}</span></div></li> `)}
          </ul>
        </div>
    
        <div id="buttonDiv">
          <button id="download" @click=${() => this.download()}>Add Service Worker</button>
          <button id="preview" @click=${() => this.inspect()}> Preview</button>
        </div>
      </div>
    
      <div class="column">

        <div id="topRow">
          <h3>Add this code to your landing page in a &lt;script&gt; tag:</h3>
          <div>
            <pre>
              <code>
                  
                ${unsafeHTML(this.highlightedWebSiteData)}
              </code>
            </pre>
          </div>
        </div>

        <div id="bottomRow">
          <h3>Add this code to your landing page in a &lt;script&gt; tag:</h3>
          <div>
            <pre>
              <code>
                ${unsafeHTML(this.highlightedSWCode)}
              </code>
            </pre>
          </div>
        </div>

      </div>
    </main>
    `;
  }
}