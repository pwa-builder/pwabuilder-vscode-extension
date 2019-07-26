import * as vscode from 'vscode';
import * as fsSync from 'fs';
import * as path from "path";

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

var optionsToOpenFile: vscode.OpenDialogOptions = {
  canSelectMany: false,
  canSelectFolders: false,
  canSelectFiles: true,
  openLabel: 'Open landing page',
  filters: {
    'HTML files': ['html'],
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



  panel.webview.onDidReceiveMessage(message => {
    console.log('message', message);

    switch (message.name) {
      case 'Ready!!!!!!': panel.webview.postMessage({ data: serviceWorkers }); break;
      case 'sw': getServiceWorkerCode(message.serviceWorkerId, message.type); break;
      case 'download': getServiceWorkerCode(message.serviceWorkerId, message.type); break;

    }

    // getServiceWorkerCode(message.serviceWorkerId, message.type); //On clicking "Preview" or "Download", a m
  });

}






async function getSWDesc(context: any, panel: vscode.WebviewPanel) {

  const response = await fetch(constants.apiUrl + "getServiceWorkersDescription");
  const data = await response.json();
  if (data && data.serviceworkers) {

    const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'out', 'index.html'));
    console.log(filePath);
    const indexHTML = fsSync.readFileSync(filePath.fsPath, 'utf8');
    console.log(indexHTML);

    panel.webview.html = indexHTML;

    return data.serviceworkers;
  }

}

//Fetches the service worker code and saves it based on the command (Preview or Download)
async function getServiceWorkerCode(serviceWorkerId: number, type: string) {
  console.log(type);
  var folderPath;
  fetchCode(serviceWorkerId).then(async (data) => {
    console.log('service worker data', data);
    switch (type) {
      case constants.preview: inspectFile(data.webSite, data.serviceWorker);
        break;
      case constants.download:
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length === 1) {
          const infoMessage = await vscode.window.showInformationMessage('We will download a file named "pwabuilder-sw.js" on your root directory', {

          },
            {
              'title': 'Ok'
            },
            {
              'title': 'Cancel'
            }
          );
          if (infoMessage.title === 'Ok') {
            var srcIndex = -1;
            constants.getDirectories(vscode.workspace.workspaceFolders[0].uri.fsPath).forEach((element, index) => {
              if (path.basename(element) === constants.src) {
                srcIndex = index;

                getFileOrFolderPath(options, element).then(folderUri => {
                  if (folderUri && folderUri[0]) {
                    folderPath = folderUri[0];
                    downloadFile(folderPath, data.webSite);
                    console.log('data.webSite', data.webSite);

                    writeToIndex(data.webSite);
                  }

                });
              }
            });

            if (srcIndex === -1) {
              getFileOrFolderPath(options).then(folderUri => {
                if (folderUri && folderUri[0]) {
                  folderPath = folderUri[0];
                  downloadFile(folderPath, data.webSite);

                  console.log('data.webSite', data.webSite);

                  writeToIndex(data.webSite);
                }

              });
            }
            else {
              break;
            }
          }
          else {

          }
        }

        else {
          const infoMessage = await vscode.window.showInformationMessage('Choose a folder you would want "pwabuilder-sw.js" to be downloaded into', {

          },
            {
              'title': 'Ok'
            },
            {
              'title': 'Cancel'
            }
          );
          if (infoMessage.title === 'Ok') {
            getFileOrFolderPath(options).then(folderUri => {
              if (folderUri && folderUri[0]) {
                folderPath = folderUri[0];
                downloadFile(folderPath, data.webSite);
                writeToIndex(data.webSite);
              }

            });
          }
          else if (infoMessage.title === 'Cancel') {

          }
        }

        break;
      default: break;
    }
  });
}

async function writeToIndex(data: any) {

  const possibleIndexes = await vscode.workspace.findFiles('**/src/index.html');
  console.group(possibleIndexes);

  if (possibleIndexes.length > 0) {

    const infoMessage = await vscode.window.showInformationMessage('This will write to your index.html file, is this ok?', {

    },
      {
        'title': 'Ok'
      },
      {
        'title': 'Cancel'
      }
    );

    console.log(infoMessage);

    if (infoMessage.title === 'Ok') {

      const indexFilePath = possibleIndexes[0].path;

      const indexFile = await vscode.workspace.openTextDocument(indexFilePath);
      console.log(indexFile);

      const openTextDocument = await vscode.window.showTextDocument(indexFile, vscode.ViewColumn.Beside, false);
      console.log(openTextDocument);

      if (openTextDocument) {
        for (let i = 0; i < openTextDocument.document.lineCount; i++) {
          const line = openTextDocument.document.lineAt(i);
          console.log(line);

          if (line.text.includes("</body>")) {
            openTextDocument.edit((edit) => {
              edit.insert(new vscode.Position(line.lineNumber, 0), `<script>${data}</script>\n`);
            });
            break;
          }
        }
      }

    }
    else if (infoMessage.title === 'Cancel') {

    }
  }

  else {
    const infoMessage = await vscode.window.showInformationMessage('Open the HTML file of your landing page. We will write into it.', {

    },
      {
        'title': 'Ok'
      },
      {
        'title': 'Cancel'
      }
    );
    if (infoMessage.title === 'Ok') {

      var filePath;
      await getFileOrFolderPath(optionsToOpenFile).then(fileUri => {
        if (fileUri && fileUri[0]) {
          filePath = fileUri[0];
        }

      });
      if (filePath !== undefined) {
        const indexFile = await vscode.workspace.openTextDocument(filePath);


        const openTextDocument = await vscode.window.showTextDocument(indexFile, vscode.ViewColumn.Beside, false);
        console.log(openTextDocument);

        if (openTextDocument) {
          for (let i = 0; i < openTextDocument.document.lineCount; i++) {
            const line = openTextDocument.document.lineAt(i);
            console.log(line);

            if (line.text === "</body>") {
              openTextDocument.edit((edit) => {
                edit.insert(new vscode.Position(line.lineNumber - 1, 0), `<script>${data}</script>\n`);
              });
              break;
            }
          }
        }
      }
    }
    else {

    }

  }


}

async function getFileOrFolderPath(options, defaultFolder?) {

  options.defaultUri = defaultFolder ? vscode.Uri.file(defaultFolder) : vscode.workspace.getWorkspaceFolder;

  return await vscode.window.showOpenDialog(options);
}

async function fetchCode(serviceWorkerId: number) {

  return await fetch(constants.apiUrl + "previewCode?ids=" + serviceWorkerId)
    .then((res: any) => res.json());


}

async function downloadFile(folderPath, website) {
  await fs.writeFile(path.join(folderPath.fsPath, 'pwabuilder-sw.js'), website).then((data: any) => {
    vscode.workspace.openTextDocument(path.join(folderPath.fsPath, 'pwabuilder-sw.js')).then(doc => {
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
    {
      postfix: '.js'
    },
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

