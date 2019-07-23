import { css, LitElement, html, property, customElement } from 'lit-element';

declare var acquireVsCodeApi: any;

const vscode = acquireVsCodeApi();

@customElement('sw-picker')
export class SWPicker extends LitElement {
  @property() serviceWorkers = [];
  @property() currentServiceWorker = null;
  @property() webSiteData = 'Loading code...';
  @property() serviceWorkerCode = 'Loading code...';

  static get styles() {
    return css`
      main {
        display: flex;
      }

      .column {
        float: left;
        width: 40%;
        padding: 20px;
        flex: 1;
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
      }

      .swTypeInnerDiv {
        margin-left: 2em;
      }
    `;
  }

  firstUpdated() {
    window.onload = () => {
      vscode.postMessage({
        name: 'Ready!!!!!!'
      });
    };

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
  }

  async updateChoice(id) {
    console.log(id);
    this.currentServiceWorker = id;
    await this.getCode();
  }

  download() {
    console.log('hello world');
    vscode.postMessage({
      name: 'download',
      serviceWorkerId: this.currentServiceWorker,
      type: 'download'
    });
  }

  inspect() {
    vscode.postMessage({
      name: 'sw',
      serviceWorkerId: this.currentServiceWorker,
      type: 'preview'
    });
  }


  render() {
    return html`

    <main>
      <div class="column">
        <h2>Choose a Service Worker</h2>

        <div id="serviceWorkerList">
          <h3> Service workers can make your site work offline, run faster, or both. Choose the functionality from our service workers below.</h3>

          <ul>
            ${this.serviceWorkers.map((i) => html`<li class="serviceWorkerType"><input type="radio" @change=${() => this.updateChoice(i.id)} name="swgroup" value="${i.id}" id="selectsw${i.id}"><div class="swTypeInnerDiv"><h4>${i.title}</h4><span> ${i.description}</span></div></li> `)}
          </ul>
        </div>

        <div id="buttonDiv">
          <button id="download" @click=${() => this.download()}>Add Service Worker</button>
          <button id="preview" @click=${() => this.inspect()}> Preview</button>
        </div>
      </div>

      <div class="column">
        <h3>Add this code to your landing page in a &lt;script&gt; tag:</h3>
        <div>
          <pre>
            <code>
              ${this.webSiteData}
            </code>
          </pre>
        </div>

        <h3>Add this code to your landing page in a &lt;script&gt; tag:</h3>
        <div>
          <pre>
            <code>
              ${this.serviceWorkerCode}
            </code>
          </pre>
        </div>
      </div>
    </main>
    `;
  }
}