// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { renderStuff } from './modules/testRender';

/*import * as fs from 'fs';
import * as path from "path";*/
// const fetch = require("node-fetch");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export interface ServiceWorker {
	id: number;
	serviceworkerPreview: string | null;
	webPreview: string | null;
	description: string | null;
	title: string | null;
	disable: boolean | false;
}
var serviceWorkers = [];
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Service Worker" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.ServiceWorker.start', () => {
		// Create and show a new webview

		/*const panel = vscode.window.createWebviewPanel(
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
				});*/

		renderStuff(context);

	});

	console.log(serviceWorkers);
	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
