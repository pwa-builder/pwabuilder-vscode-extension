import * as vscode from 'vscode';
import * as fsSync from 'fs';
import * as path from "path";
import { MessageChannel } from 'worker_threads';
import { ServiceWorker } from './ServiceWorker';
import * as constants from './constants';

const fs = require('fs').promises;

const fetch = require('node-fetch');
const tmp = require('tmp');

var options: vscode.OpenDialogOptions = {
  canSelectMany: false,
  canSelectFolders: true,
  canSelectFiles: false,
  openLabel: 'Save',
  filters: {
    'Text files': ['txt'],
    'All files': ['*']
  },
  defaultUri: null
};





export async function generateWebView(context) {
  const panel = vscode.window.createWebviewPanel(
    'serviceWorker', // Identifies the type of the webview. Used internally
    'Service Worker', // Title of the panel displayed to the user			 
    vscode.ViewColumn.One,// Editor column to show the new webview panel in.
    {
      // Enable scripts in the webview
      enableScripts: true,
      retainContextWhenHidden: true
    }
    // Webview options. More on these later.
  );
  //fetches the service worker descriptions

  var serviceWorkers = await getSWDesc(context, panel);
  console.log(serviceWorkers);


  // handle panel lifecycle
  /*panel.onDidChangeViewState(async event => {
      console.log(event);

      if (event.webviewPanel.visible === true) {
          // await getSWDesc(context, panel);
          console.log('im visible');

          let serviceWorkers = await getSWDesc(context, panel);
          console.log(serviceWorkers);

          panel.webview.postMessage({ data: serviceWorkers });

      }
  });*/

  panel.webview.onDidReceiveMessage(message => {
    console.log('message type', message.type);

    switch (message.name) {
      case 'Ready!!!!!!': panel.webview.postMessage({ data: serviceWorkers }); break;
      case 'sw': getServiceWorkerCode(message.serviceWorkerId, message.type); break;
      case 'download': getServiceWorkerCode(message.serviceWorkerId, message.type);

    }

    // getServiceWorkerCode(message.serviceWorkerId, message.type); //On clicking "Preview" or "Download", a m
  });

}






async function getSWDesc(context: any, panel: vscode.WebviewPanel) {
  /*fetch(constants.apiUrl + "getServiceWorkersDescription")
      .then((res: any) => res.json()).then((data: any) => {
          let serviceWorkers: ServiceWorker[] = data.serviceworkers;
          const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'pages', 'serviceworker.html'));
          const swHTML = fsSync.readFileSync(filePath.fsPath, 'utf8');
          panel.webview.html = swHTML; //renders HTML of the main page

          /*console.log(panel.active);
          console.log(panel.visible);*/



  /*if (panel.active) {
      panel.webview.postMessage({ data: serviceWorkers });
  }*/

  // panel.onDidChangeViewState(() => {

  //     panel.webview.postMessage({ data: serviceWorkers });
  // });

  // setTimeout(() => {
  //     panel.webview.postMessage({ data: serviceWorkers }); //Is there a better way to ensure that the message is sent after page load?
  // }, 5000);
  /* return serviceWorkers;
});*/

  const response = await fetch(constants.apiUrl + "getServiceWorkersDescription");
  const data = await response.json();
  if (data && data.serviceworkers) {

    const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'pages', 'serviceworker.html'));
    const swHTML = fsSync.readFileSync(filePath.fsPath, 'utf8');
    panel.webview.html = swHTML;

    return data.serviceworkers;
  }

}

//Fetches the service worker code and saves it based on the command (Preview or Download)
async function getServiceWorkerCode(serviceWorkerId: number, type: string) {
  var folderPath;
  fetchCode(serviceWorkerId).then((data) => {
    console.log('service worker data', data);
    switch (type) {
      case constants.preview: inspectFile(data.webSite, data.serviceWorker);
        break;
      case constants.download: if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {

        var srcIndex = -1;
        constants.getDirectories(vscode.workspace.workspaceFolders[0].uri.fsPath).forEach((element, index) => {
          if (path.basename(element) === constants.src) {
            srcIndex = index;

            getFolderPath(element).then(folderUri => {
              if (folderUri && folderUri[0]) {
                folderPath = folderUri[0];
                downloadFile(folderPath, data.webSite);
              }

            });
          }
        });
        if (srcIndex === -1) {
          getFolderPath().then(folderUri => {
            if (folderUri && folderUri[0]) {
              folderPath = folderUri[0];
              downloadFile(folderPath, data.webSite);
            }

          });
        }
        else {
          break;
        }
      }

      else {
        getFolderPath().then(folderUri => {
          if (folderUri && folderUri[0]) {
            folderPath = folderUri[0];
            downloadFile(folderPath, data.webSite);
          }

        });
      }

        break;
      default: break;
    }
  });



}

async function getFolderPath(defaultFolder?) {

  options.defaultUri = defaultFolder ? vscode.Uri.file(defaultFolder) : null;

  return await vscode.window.showOpenDialog(options);
}
async function fetchCode(serviceWorkerId: number) {

  return await fetch(constants.apiUrl + "previewCode?ids=" + serviceWorkerId)
    .then((res: any) => res.json());


}

async function downloadFile(folderPath, website) {
  await fs.writeFile(path.join(folderPath.fsPath, 'pwabuilder-sw.txt'), website).then((data: any) => {
    vscode.workspace.openTextDocument(path.join(folderPath.fsPath, 'pwabuilder-sw.txt')).then(doc => {
      vscode.window.showTextDocument(doc);
    });
  });

}


async function inspectFile(website, serviceWorker) {
  await createAndOpenTemporaryFile(website);

  await createAndOpenTemporaryFile(serviceWorker);
}

function createAndOpenTemporaryFile(website: any): Promise<any> {
  return tmp.file(
    async function _tempFileCreated(err, path, fd, cleanupCallback) {
      if (err) {
        throw err;
      }

      /*await fs.writeFile(path, website).then((data: any) => {
        vscode.workspace.openTextDocument(path).then(doc => {
          vscode.window.showTextDocument(doc);
        });
      });*/

      console.log(path);

      await fs.writeFile(path, website);
      const doc = await vscode.workspace.openTextDocument(path);
      vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, false);

    });
}

