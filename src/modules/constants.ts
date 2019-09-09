import * as vscode from "vscode";

const { lstatSync, readdirSync } = require("fs");
import * as path from "path";

//Constant strings
export const src = "src";
export const preview = "preview";
export const download = "download";
export const ServiceWorkerApiUrl =
  "https://pwabuilder-api-prod.azurewebsites.net/serviceworkers/";
export const ImageGenApiUrl =
  "https://appimagegenerator-prod.azurewebsites.net";
export const swFileName = "pwabuilder-sw.js";
export const manifestFileName = "manifest.json";
export const platFormName = "android";

//Related to Directories
const isDirectory = source => lstatSync(source).isDirectory();
export const getDirectories = source =>
  readdirSync(source)
    .map(name => path.join(source, name))
    .filter(isDirectory);

//CSS
export const errorRed = "#ff0000";

//IntelliSense
export class NameDescription {
  name: string;
  description: string;
  constructor(nameValue, descriptionValue) {
    this.name = nameValue;
    this.description = descriptionValue;
  }
}
export const manifestIntelliSense = [
  new NameDescription(
    "dir",
    "The dir member specifies the base direction for the directionality-capable members of the manifest. The dir member's value can be set to one of the text-direction values : ltr, rtl and auto"
  ),
  new NameDescription(
    "lang",
    "The lang member is a language tag (string) that specifies the primary language for the values of the manifest's directionality-capable members (as knowing the language can also help with directionality"
  ),
  new NameDescription(
    "short_name",
    "The short_name member represents a name that is intended to be used where there is insufficient space to display the full name of the PWA."
  ),
  new NameDescription(
    "name",
    "A string that represents the name of the PWA as it is usually displayed to the user"
  ),
  new NameDescription(
    "description",
    "The description member allows the developer to describe the purpose of the PWA."
  ),
  new NameDescription(
    "scope",
    "The scope member is a string that represents the navigation scope of this PWA's application context."
  ),
  new NameDescription(
    "icons",
    "An array of icons that serve as the iconic representations of the PWA in various contexts"
  ),
  new NameDescription(
    "display",
    "The item represents the developer's preferred display mode for the PWA. The recommended type is standalone"
  ),
  new NameDescription(
    "orientation",
    "Serves as the default orientation for all top-level browsing contexts of the PWA."
  ),
  new NameDescription(
    "start_url",
    "Represents the start URL , which is URL that the developer would prefer the user agent load when the user launches the PWA"
  ),
  new NameDescription(
    "serviceworker",
    "The serviceworker member describes a service worker"
  ),
  new NameDescription(
    "theme_color",
    "The theme_color member serves as the default theme color for an application context."
  ),
  new NameDescription(
    "related_applications",
    "A related application is an application accessible to the underlying application platform that has a relationship with the PWA associated with a manifest."
  ),
  new NameDescription(
    "prefer_related_applications",
    "a boolean value that is used as a hint for the user agent to say that related applications should be preferred over the PWA."
  ),
  new NameDescription(
    "background_color",
    "Describes the expected background color of the PWA."
  ),
  new NameDescription(
    "categories",
    "Describes the expected application categories to which the PWA belongs."
  ),
  new NameDescription(
    "screenshots",
    "A list of screenshot images representing the PWA in common usage scenarios"
  ),
  new NameDescription(
    "iarc_rating_id",
    "Represents the IARC certification code of the PWA and is used to determine which ages the PWA is responsible for."
  )
];
