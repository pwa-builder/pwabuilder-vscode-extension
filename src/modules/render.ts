import * as vscode from "vscode";
import * as fsSync from "fs";
import * as path from "path";
import * as upath from "upath";
import * as constants from "./constants";

const https = require("https");
const fs = require("fs").promises;
const request = require("request");
const AdmZip = require("adm-zip");

const fetch = require("node-fetch");
const tmp = require("tmp");
var { promisify } = require("util");
var sizeOf = promisify(require("image-size"));

var options: vscode.OpenDialogOptions = {
  // This is for selecting folders from the filepicker
  canSelectMany: false,
  canSelectFolders: true,
  canSelectFiles: false,
  openLabel: "Save",
  filters: {
    "Text files": ["txt"],
    "All files": ["*"]
  },
  defaultUri: null
};

var optionsToOpenFile: vscode.OpenDialogOptions = {
  // This is for selecting files from the filepicker
  canSelectMany: false,
  canSelectFolders: false,
  canSelectFiles: true,
  openLabel: "Open landing page",
  filters: {
    "HTML files": ["html"],
    "All files": ["*"]
  },
  defaultUri: null
};

export async function generateWebView(context) {
  const panel = vscode.window.createWebviewPanel(
    "serviceWorker", // Identifies the type of the webview. Used internally
    "PWABuilder", // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in.
    {
      // Enable scripts in the webview
      enableScripts: true,
      retainContextWhenHidden: true
    }
    // Webview options. More on these later.
  );
  //fetches the service worker descriptions

  const serviceWorkers = await getSWDesc(context, panel);
  console.log(serviceWorkers);

  panel.webview.onDidReceiveMessage(async message => {
    switch (message.name) {
      case "manifest":
        await generateManifest(message);
        break;
      case "Ready!!!!!!":
        panel.webview.postMessage({ data: serviceWorkers });
        break;
      case "sw":
        getServiceWorkerCode(message.serviceWorkerId, message.type);
        break;
      case "download":
        getServiceWorkerCode(message.serviceWorkerId, message.type);
        break;
    }
  });
}

function OrderJSON(JSONObject) {
  var OrderedObj = JSON.parse(
    JSON.stringify(
      JSONObject,
      [
        "dir",
        "lang",
        "name",
        "scope",
        "display",
        "start_url",
        "short_name",
        "theme_color",
        "description",
        "orientation",
        "background_color",
        "related_applications",
        "prefer_related_applications",
        "screenshots",
        "icons",
        "categories"
      ],
      4
    )
  );
  if (JSONObject.screenshots !== undefined) {
    OrderedObj.screenshots = JSON.parse(JSON.stringify(JSONObject.screenshots));
  }
  return OrderedObj;
}

async function generateIcons(iconUrl: string, folderPath) {
  // console.log(iconUrl);
  /*const file = fsSync.createWriteStream("icons.zip");
  request(constants.ImageGenApiUrl + iconUrl, (err, res) => {
    if (err) {
      console.error(err);
    }
    else {
      file.pipe(res);
      file.on('end', () => {
        console.log('we should have a file now');
      });
    }
  });*/

  const unzippedPath = folderPath + "/icons";
  const unzippedPathToIcons = unzippedPath + "/" + constants.platFormName;
  var pathToTemp: any;
  await createTempZip().then(pathToFile => {
    pathToTemp = pathToFile;
  });

  return new Promise(resolve => {
    request(constants.ImageGenApiUrl + iconUrl)
      .pipe(fsSync.createWriteStream(pathToTemp))
      .on("finish", () => {
        let zip = new AdmZip(pathToTemp);
        const entries = zip.getEntries();

        console.log(entries);

        zip.extractAllTo(unzippedPath, true);

        fsSync.readdir(unzippedPathToIcons, function (err, items) {
          console.log(items);
          resolve(items);
        });
      });
  });
}

async function generateManifest(message) {
  var JSONObject = OrderJSON(message.JSONObject);
  var srcIndex = -1;
  var folderPath;
  if (vscode.workspace.workspaceFolders === undefined) {
    await getFileOrFolderPath(options).then(folderUri => {
      if (folderUri && folderUri[0]) {
        folderPath = folderUri[0];
      }
    });
  } else {
    constants
      .getDirectories(vscode.workspace.workspaceFolders[0].uri.fsPath)
      .forEach((element, index) => {
        // Tries to find src directory
        if (path.basename(element) === constants.src) {
          //src is found
          srcIndex = index;
          folderPath = element;

          console.log('srcIndex', srcIndex);
          writeIndexLink();
        }
      });
    if (srcIndex === -1) {
      //src is not found
      await getFileOrFolderPath(options).then(folderUri => {
        if (folderUri && folderUri[0]) {
          folderPath = folderUri[0];
        }
      });
    }
  }
  if (JSONObject.screenshots !== undefined) {
    JSONObject = await downloadScreenshots(JSONObject, folderPath);
  } //Downloads screenshots into the folder where manifest.json will be created.
  if (message.icon !== undefined && message.icon.trim() !== "") {
    await generateIcons(
      message.icon,
      typeof folderPath === "string" ? folderPath : folderPath.fsPath
    ).then(files => {
      JSONObject = calculateIconSize(files, JSONObject);
    });
  }
  //Remove categories if there are none
  if (
    JSONObject.categories === undefined ||
    JSONObject.categories.length === 0
  ) {
    delete JSONObject["categories"];
  }
  var JSONString = JSON.stringify(JSONObject, null, 4);

  await createAndDownloadFile(
    folderPath,
    JSONString,
    constants.manifestFileName
  );
}

async function writeIndexLink() {
  const possibleIndexes = await vscode.workspace.findFiles("**/src/index.html");
  console.group(possibleIndexes);

  if (possibleIndexes.length > 0) {
    const infoMessage = await vscode.window.showInformationMessage(
      "This will write to your index.html file, is this ok?",
      {},
      {
        title: "Ok"
      },
      {
        title: "Cancel"
      }
    );

    console.log(infoMessage);

    if (infoMessage.title === "Ok") {
      const indexFilePath = possibleIndexes[0].path;

      const indexFile = await vscode.workspace.openTextDocument(indexFilePath);
      console.log(indexFile);

      const openTextDocument = await vscode.window.showTextDocument(
        indexFile,
        vscode.ViewColumn.Beside,
        false
      );
      console.log(openTextDocument);

      if (openTextDocument) {
        for (let i = 0; i < openTextDocument.document.lineCount; i++) {
          const line = openTextDocument.document.lineAt(i);

          if (line.text.includes("</head>")) {
            openTextDocument.edit(edit => {
              edit.insert(
                new vscode.Position(line.lineNumber, 0),
                `<link rel="manifest" href="/manifest.json">\n`
              );
            });
            break;
          }
        }
      }
    } else if (infoMessage.title === "Cancel") {
    }
  } else {
    const infoMessage = await vscode.window.showInformationMessage(
      "Open the HTML file of your landing page. We will write into it.",
      {},
      {
        title: "Ok"
      },
      {
        title: "Cancel"
      }
    );
    if (infoMessage.title === "Ok") {
      var filePath;
      await getFileOrFolderPath(optionsToOpenFile).then(fileUri => {
        if (fileUri && fileUri[0]) {
          filePath = fileUri[0];
        }
      });
      if (filePath !== undefined) {
        const indexFile = await vscode.workspace.openTextDocument(filePath);

        const openTextDocument = await vscode.window.showTextDocument(
          indexFile,
          vscode.ViewColumn.Beside,
          false
        );
        console.log(openTextDocument);

        if (openTextDocument) {
          for (let i = 0; i < openTextDocument.document.lineCount; i++) {
            const line = openTextDocument.document.lineAt(i);
            console.log(line);

            if (line.text.includes("</head>")) {
              openTextDocument.edit(edit => {
                edit.insert(
                  new vscode.Position(line.lineNumber, 0),
                  `<link rel="manifest" href="/manifest.json">\n`
                );
              });
              break;
            }
          }
        }
      }
    } else {
    }
  }
}

function calculateIconSize(files: any, JSONObject: any) {
  var arrayOfFileObjects = [];
  for (var file of files) {
    var fileNameArray = file.split("-");
    var sizes = fileNameArray[2] + "x" + fileNameArray[2];
    var src = "icons/android/" + file;
    var obj = { src: src, sizes: sizes };
    arrayOfFileObjects.push(obj);
  }
  JSONObject.icons = arrayOfFileObjects;
  return JSONObject;
}

export async function generateManifestWebview(context) {
  const panel = vscode.window.createWebviewPanel(
    "javascript_preview",
    "PWABuilder",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  const serviceWorkers = await getSWDesc(context, panel);
  console.log(serviceWorkers);

  panel.webview.onDidReceiveMessage(async message => {
    console.log(message.FormData);
    switch (message.name) {
      case "manifest":
        await generateManifest(message);
        break;
      case "Ready!!!!!!":
        panel.webview.postMessage({ data: serviceWorkers });
        break;
      case "sw":
        getServiceWorkerCode(message.serviceWorkerId, message.type);
        break;
      case "download":
        getServiceWorkerCode(message.serviceWorkerId, message.type);
        break;
    }
  });
  const filePath: vscode.Uri = vscode.Uri.file(
    path.join(context.extensionPath, "out", "index.manifest.html")
  );
  const indexHTML = fsSync.readFileSync(filePath.fsPath, "utf8");

  panel.webview.html = indexHTML;
}

async function downloadScreenshots(JSONObject, folderPath) {
  var i;
  folderPath = typeof folderPath === "string" ? folderPath : folderPath.fsPath; //Fix this later
  if (!fsSync.existsSync(path.join(folderPath, "screenshots"))) {
    try {
      fsSync.mkdirSync(path.join(folderPath, "screenshots")); //Create dir called "screenshots"
      folderPath = path.join(folderPath, "screenshots");
    } catch (e) {
      vscode.window.showErrorMessage(
        "Something went wrong. Could not access your workspace!"
      );
    }
  }

  for (i = 0; i < JSONObject.screenshots.length; i++) {
    //Go through each image

    var fileName = "screenshots\\screenshot" + (i > 0 ? i : "") + ".png";
    await fs
      .copyFile(
        JSONObject.screenshots[i].src,
        path.join(folderPath, "screenshot" + (i > 0 ? i : "") + ".png"),
        function (err, data) {
          if (err) {
            throw err;
          }
          // Fail if the file can't be read.
        }
      )
      .then(data => {
        console.log(upath.toUnix(fileName));
        JSONObject.screenshots[i].src = upath.toUnix(fileName);
        //Change src in the jsonObject to the new path
      });
  }
  return JSONObject;
}

async function getSWDesc(context: any, panel: vscode.WebviewPanel) {
  const response = await fetch(
    constants.ServiceWorkerApiUrl + "getServiceWorkersDescription"
  );
  const data = await response.json();
  if (data && data.serviceworkers) {
    const filePath: vscode.Uri = vscode.Uri.file(
      path.join(context.extensionPath, "out", "index.html")
    );
    console.log(filePath);
    const indexHTML = fsSync.readFileSync(filePath.fsPath, "utf8");
    console.log(indexHTML);

    panel.webview.html = indexHTML;

    return data.serviceworkers;
  }
}

//Fetches the service worker code and saves it based on the command (Preview or Download)
async function getServiceWorkerCode(serviceWorkerId: number, type: string) {
  console.log(type);
  var folderPath;
  fetchCode(serviceWorkerId).then(async data => {
    console.log("service worker data", data);
    switch (type) {
      case constants.preview:
        inspectFile(data.webSite, data.serviceWorker);
        break;
      case constants.download:
        if (
          vscode.workspace.workspaceFolders &&
          vscode.workspace.workspaceFolders.length === 1
        ) {
          const infoMessage = await vscode.window.showInformationMessage(
            'We will download a file named "pwabuilder-sw.js" on your root directory',
            {},
            {
              title: "Ok"
            },
            {
              title: "Cancel"
            }
          );
          if (infoMessage.title === "Ok") {
            var srcIndex = -1;
            constants
              .getDirectories(vscode.workspace.workspaceFolders[0].uri.fsPath)
              .forEach((element, index) => {
                if (path.basename(element) === constants.src) {
                  srcIndex = index;

                  getFileOrFolderPath(options, element).then(folderUri => {
                    if (folderUri && folderUri[0]) {
                      folderPath = folderUri[0];
                      createAndDownloadFile(
                        folderPath,
                        data.serviceWorker,
                        constants.swFileName
                      );

                      writeToIndex(data.webSite);
                    }
                  });
                }
              });

            if (srcIndex === -1) {
              getFileOrFolderPath(options).then(folderUri => {
                if (folderUri && folderUri[0]) {
                  folderPath = folderUri[0];
                  createAndDownloadFile(
                    folderPath,
                    data.serviceWorker,
                    constants.swFileName
                  );

                  writeToIndex(data.webSite);
                }
              });
            } else {
              break;
            }
          } else {
          }
        } else {
          const infoMessage = await vscode.window.showInformationMessage(
            'Choose a folder you would want "pwabuilder-sw.js" to be downloaded into',
            {},
            {
              title: "Ok"
            },
            {
              title: "Cancel"
            }
          );
          if (infoMessage.title === "Ok") {
            getFileOrFolderPath(options).then(folderUri => {
              if (folderUri && folderUri[0]) {
                folderPath = folderUri[0];
                createAndDownloadFile(
                  folderPath,
                  data.serviceWorker,
                  constants.swFileName
                );
                writeToIndex(data.webSite);
              }
            });
          } else if (infoMessage.title === "Cancel") {
          }
        }

        break;
      default:
        break;
    }
  });
}

async function writeToIndex(data: any) {
  const possibleIndexes = await vscode.workspace.findFiles("**/src/index.html");
  console.group(possibleIndexes);

  if (possibleIndexes.length > 0) {
    const infoMessage = await vscode.window.showInformationMessage(
      "This will write to your index.html file, is this ok?",
      {},
      {
        title: "Ok"
      },
      {
        title: "Cancel"
      }
    );

    console.log(infoMessage);

    if (infoMessage.title === "Ok") {
      const indexFilePath = possibleIndexes[0].path;

      const indexFile = await vscode.workspace.openTextDocument(indexFilePath);
      console.log(indexFile);

      const openTextDocument = await vscode.window.showTextDocument(
        indexFile,
        vscode.ViewColumn.Beside,
        false
      );
      console.log(openTextDocument);

      if (openTextDocument) {
        for (let i = 0; i < openTextDocument.document.lineCount; i++) {
          const line = openTextDocument.document.lineAt(i);
          console.log(line);

          if (line.text.includes("</body>")) {
            openTextDocument.edit(edit => {
              edit.insert(
                new vscode.Position(line.lineNumber, 0),
                `<script>${data}</script>\n`
              );
            });
            break;
          }
        }
      }
    } else if (infoMessage.title === "Cancel") {
    }
  } else {
    const infoMessage = await vscode.window.showInformationMessage(
      "Open the HTML file of your landing page. We will write into it.",
      {},
      {
        title: "Ok"
      },
      {
        title: "Cancel"
      }
    );
    if (infoMessage.title === "Ok") {
      var filePath;
      await getFileOrFolderPath(optionsToOpenFile).then(fileUri => {
        if (fileUri && fileUri[0]) {
          filePath = fileUri[0];
        }
      });
      if (filePath !== undefined) {
        const indexFile = await vscode.workspace.openTextDocument(filePath);

        const openTextDocument = await vscode.window.showTextDocument(
          indexFile,
          vscode.ViewColumn.Beside,
          false
        );
        console.log(openTextDocument);

        if (openTextDocument) {
          for (let i = 0; i < openTextDocument.document.lineCount; i++) {
            const line = openTextDocument.document.lineAt(i);
            console.log(line);

            if (line.text.includes("</body>")) {
              openTextDocument.edit(edit => {
                edit.insert(
                  new vscode.Position(line.lineNumber - 1, 0),
                  `<script>${data}</script>\n`
                );
              });
              break;
            }
          }
        }
      }
    } else {
    }
  }
}

async function getFileOrFolderPath(options, defaultFolder?) {
  options.defaultUri = defaultFolder
    ? vscode.Uri.file(defaultFolder)
    : vscode.workspace.getWorkspaceFolder;

  return await vscode.window.showOpenDialog(options);
}

async function fetchCode(serviceWorkerId: number) {
  return await fetch(
    constants.ServiceWorkerApiUrl + "previewCode?ids=" + serviceWorkerId
  ).then((res: any) => res.json());
}

async function createAndDownloadFile(folderPath, website, fileName) {
  folderPath = typeof folderPath === "string" ? folderPath : folderPath.fsPath;
  await fs
    .writeFile(path.join(folderPath, fileName), website)
    .then((data: any) => {
      vscode.workspace
        .openTextDocument(path.join(folderPath, fileName))
        .then(doc => {
          vscode.window.showTextDocument(doc);
        });
    });
}

async function inspectFile(website, serviceWorker) {
  await createAndOpenTemporaryFile(website);
  await createAndOpenTemporaryFile(serviceWorker);
}

async function createAndOpenTemporaryFile(website: any): Promise<any> {
  return tmp.file(
    {
      postfix: ".js"
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
    }
  );
}

async function createTempZip() {
  return new Promise(resolve => {
    tmp.file(
      {
        postfix: ".zip"
      },
      async function _tempFileCreated(err, path, fd, cleanupCallback) {
        if (err) {
          throw err;
        }
        resolve(path);
      }
    );
  });
}
