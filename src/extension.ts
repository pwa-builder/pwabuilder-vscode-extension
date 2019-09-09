// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as intellisense from "./modules/intellisense";
import { generateWebView, generateManifestWebview } from "./modules/render";

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

export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "Service Worker" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let swCommand = vscode.commands.registerCommand(
    "extension.ServiceWorker.start",
    async () => {
      //Create the Web View
      await generateWebView(context);
    }
  );

  let manifestCommand = vscode.commands.registerCommand(
    "extension.manifest.start",
    async () => {
      await generateManifestWebview(context);
    }
  );

  context.subscriptions.push(swCommand, manifestCommand);
  const completionProvider = intellisense.HoverIntelForManifest(context);
  context.subscriptions.push(completionProvider);
  intellisense.CompletionIntelForManifest(context);
}

// this method is called when your extension is deactivated
export function deactivate() {}
