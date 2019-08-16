import { css, LitElement, html, property, customElement } from 'lit-element';
import { constants } from 'fs';
import { OrientationList, ManifestInfo, Screenshot } from './constants';
import dropdownData from './languages.json';
import { FileStat } from 'vscode';


declare var acquireVsCodeApi: any;
var sampleObject = new ManifestInfo();
const vscode = acquireVsCodeApi();
var i;
@customElement('manifest-gen')
export class Manifest extends LitElement {
    @property() name = '';
    @property() shortname = '';
    @property() desc;
    @property() lang = '';
    @property() orientation = OrientationList[0].type;
    @property() icons = [];
    @property() languageData = dropdownData;
    @property() defaultLanguage = "en";
    @property() color = "#ffffff";
    @property() screenshots: Screenshot[];
    @property() categories = "";
    @property() start_url = '/';
    render() {
        return html`<h1><a>Manifest Generator</a></h1>
<form enctype="multipart/form-data" method="post" id="manifestForm" name="manifestForm">
    <div>
        <h3>Fill out the following fields to generate your manifest file.</h3>
    </div>
    <ul>

        <label>Name </label>
        <div>
            <input id="name" name="name" type="text" maxlength="255" value="" @change="${e => this.onNameChange(e.target.value)} "
                required>
        </div>

        <label>Short name</label>
        <div>
            <input id="shortname" name="short-name" type="text" maxlength="255" value="${this.shortname}" @change="${e => this.onShortnameChange(e.target.value)}"
                required>
        </div>

        <label for="description">Description </label>
        <div>
            <textarea id="description" name="description" @change="${e => this.onDescChange(e.target.value)}" required>${this.desc}</textarea>
        </div>


        <label>Language</label>
        <div>
            <select id="language" name="language" @change="${e => this.onLanguageChange(e.target.value)}">

                ${this.languageData.map((i) => html`<option value=${JSON.stringify(i)}>${i.name} `)}

            </select>
        </div>
        <label>Orientation </label>
        <div>
            <select id="orientation" name="orientation" @change="${e => this.onOrientationChange(e.target.value)}">
                ${OrientationList.map((i) => html`<option value=${i.id} @click=${()=>
                    this.onOrientationChange(i.id)}>${i.type} `)}

            </select>
        </div>

        <label>Upload an Icon </label>
        <div>
            <input id="icon" name="fileName" type="file" @change="${e => this.onIconSelection(e.target.value)}" />
        </div>

        <label for="color">Color </label>
        <div>
            <input type="color" value="${this.color}" @change="${e => this.onColorChange(e.target.value)}">
        </div>
        <label>Upload Screenshots</label>
        <div>
            <input id="screenshot" type="file" accept="image/*" @change="${e => this.onScreenshotSelection()}" multiple />
        </div>

        <label>Category </label>
        <div>
            <input id="category" name="category" type="text" maxlength="255" value="${this.categories}" @change="${e => this.onCategoryChange(e.target.value)}">
        </div>

        <label>Start Url </label>
        <div>
            <input id="start_url" name="start_url" type="text" maxlength="255" value="${this.start_url}" @change="${e => this.onStartUrlChange(e.target.value)}">
        </div>



        <input id="saveForm" type="submit" name="submit" value="Submit" @click=${()=> this.submit()}/>

    </ul>
</form>`;


    }


    onCategoryChange(categoryValue) {
        this.categories = categoryValue;
    }
    onStartUrlChange(startUrlValue) {
        this.start_url = startUrlValue;
    }
    onShortnameChange(shortnameValue) {
        this.shortname = shortnameValue;
    }
    async onScreenshotSelection() {
        const files: any = (this.shadowRoot.querySelector('#screenshot') as HTMLInputElement).files;
        sampleObject.screenshots = [];
        var img = new Image();

        for (i = 0; i < files.length; i++) {
            console.log(i);
            var url = window.URL.createObjectURL(files[i]);
            var screenshot = new Screenshot();
            screenshot.src = files[i].path;
            console.log(files[i].path);
            screenshot.type = files[i].type;
            await this.getImageDimensions(url)
                .then((data: any) => {
                    screenshot.sizes = data.height + 'x' + data.width;
                });

            sampleObject.screenshots.push(screenshot);

        }




    }

    getImageDimensions(url) {
        let img = new Image();
        img.src = url;
        return new Promise((resolve, reject) => {

            img.onload = function () {
                var width = img.width;
                var height = img.height;
                resolve({ height, width });
            };
        });
    }
    onIconSelection(iconValue) {


    }

    onColorChange(colorValue) {
        this.color = colorValue;

    }
    onLanguageChange(languageValue) {
        console.log(languageValue);
        var lang = JSON.parse(languageValue);
        sampleObject.lang = lang.code;
        sampleObject.dir = lang.dir;

        // this.defaultLanguage = languageValue.code;
        // console.log(languageValue.dir);
        // sampleObject.dir = languageValue.dir;
        


    }
    onNameChange(nameValue) {
        this.name = nameValue;
        this.shortname = this.name;


    }

    onOrientationChange(orientationValue) {
        this.orientation = OrientationList[orientationValue].type;

    }

    onDescChange(descValue) {
        this.desc = descValue;
    }

    submit() {

        //to-do make initial form data
        //console.log(this.shadowRoot.querySelector('#manifestForm'));
        //const testData: any = new FormData(this.shadowRoot.querySelector('#manifestForm'));
        const file: any = (this.shadowRoot.querySelector('#icon') as HTMLInputElement).files[0];
        console.log("This is the file" + file);
        //to-do append default values that the API needs
        // testData.append('')

        let testData = {}

        testData['fileName'] = file;
        testData['padding'] = 0.3;
        testData['colorOption'] = 0;
        testData['color'] = 0;
        testData['colorChanged'] = 0;
        testData['platform'] = "windows10";
        console.log("category" + this.categories);

        
        sampleObject.description = this.desc;
        sampleObject.name = this.name;
        sampleObject.orientation = this.orientation;
        sampleObject.short_name = this.shortname;
        sampleObject.theme_color = this.color;
        sampleObject.background_color = this.color;
        sampleObject.categories = this.categories;

        sampleObject.start_url = this.start_url;
        vscode.postMessage({
            name: 'manifest',
            FormData: testData,
            JSONObject: sampleObject
        });


    }



}

