import * as vscode from 'vscode';
import * as constants from './constants';


export function CompletionIntelForManifest(context) {

return vscode.languages.registerCompletionItemProvider(
    {
      language: 'json',
      scheme: 'file',
      pattern: '**/manifest.json'
    },
    {
      provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

        // get all text until the `position` and check if it reads `console.`
        // and iff so then complete if `log`, `warn`, and `error`
        let linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.includes('display')) {
          return undefined;
        }

        return [
          new vscode.CompletionItem('"standalone"', vscode.CompletionItemKind.Text),
          new vscode.CompletionItem('"fullscreen"', vscode.CompletionItemKind.Text),
          new vscode.CompletionItem('"minimal-ui"', vscode.CompletionItemKind.Text),
          new vscode.CompletionItem('"browser"', vscode.CompletionItemKind.Text),
        ];
      }
    },
    ':', '"', ': "', ':"' // triggered whenever a '.' is being typed
  );

  

}



export function HoverIntelForManifest(context) {
    return vscode.languages.registerHoverProvider(
        { pattern: '**/manifest.json' },
        {
          provideHover(document, position, token) {
            console.log(document, position, token);
            const testVar = document.lineAt(position.line);
            for (var item of constants.manifestIntelliSense) {
              if (testVar.text.toLowerCase().includes(item.name)) {
                return new vscode.Hover(item.description);
              }
            }
    
            if (testVar.text.toLowerCase().includes('zzzz')) {
              return new vscode.Hover('this is category', new vscode.Range(new vscode.Position(1, 4), new vscode.Position(1, 11)));
            }
    
          }
        }
      );
}