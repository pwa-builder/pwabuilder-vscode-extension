import * as vscode from 'vscode';

const { lstatSync, readdirSync } = require('fs');
import * as path from "path";

//Constant strings
export const src = "src";
export const preview = "preview";
export const download = "download";
export const apiUrl  = "https://pwabuilder-api-prod.azurewebsites.net/serviceworkers/";



//Related to Directories 
const isDirectory = source => lstatSync(source).isDirectory();
export const getDirectories = source =>
readdirSync(source).map((name) => path.join(source, name)).filter(isDirectory);
