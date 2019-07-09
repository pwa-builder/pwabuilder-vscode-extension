import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from "path";

const fetch = require('node-fetch');

export interface ServiceWorker {
    id: number;
    serviceworkerPreview: string | null;
    webPreview: string | null;
    description: string | null;
    title: string | null;
    disable: boolean | false;
}

export function renderStuff(context) {
    const panel = vscode.window.createWebviewPanel(
        'serviceWorker', // Identifies the type of the webview. Used internally
        'Service Worker', // Title of the panel displayed to the user			 
        vscode.ViewColumn.One,// Editor column to show the new webview panel in.
        {
            // Enable scripts in the webview
            enableScripts: true
        }
        // Webview options. More on these later.
    );
    fetch("https://pwabuilder-api-prod.azurewebsites.net/serviceworkers/getServiceWorkersDescription")
        .then(
            (res: any) => res.json()).then((data: any) => {
                let serviceWorkers: ServiceWorker[] = data.serviceworkers;
                const filePath: vscode.Uri = vscode.Uri.file(path.join(context.extensionPath, 'src', 'pages', 'serviceworker.html'));
                //panel.webview.html = fs.readFileSync(filePath.fsPath, 'utf8');
                const swHTML = fs.readFileSync(filePath.fsPath, 'utf8');
                panel.webview.html = swHTML;

                // panel.webview.html = `<h1>Hello world</h1>`;

                setTimeout(() => {
                    panel.webview.postMessage({data: serviceWorkers});
                }, 1500);

            });

}