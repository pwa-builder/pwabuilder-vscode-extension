import { css, LitElement, html, property, customElement } from 'lit-element';

import { SelectPure } from './SelectPure';

import { constants } from 'fs';
import { OrientationList, ManifestInfo, Screenshot, categoryData } from './constants';
import dropdownData from './languages.json';


var icon = "";

var sampleObject = new ManifestInfo();


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
  @property() items = ["Does", "This", "Work"];


  static get styles() {
    return css`
    .select-wrapper {
  margin: auto;
  max-width: 600px;
  width: calc(100% - 40px);
}

.select-pure__select {
  align-items: center;
  background: #f9f9f8;
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  color: #363b3e;
  cursor: pointer;
  display: flex;
  font-size: 16px;
  font-weight: 500;
  justify-content: left;
  min-height: 44px;
  padding: 5px 10px;
  position: relative;
  transition: 0.2s;
  width: 100%;
}

.select-pure__options {
  border-radius: 4px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  box-sizing: border-box;
  color: #363b3e;
  display: none;
  left: 0;
  max-height: 221px;
  overflow-y: scroll;
  position: absolute;
  top: 50px;
  width: 100%;
  z-index: 5;
}

.select-pure__select--opened .select-pure__options {
  display: block;
}

.select-pure__option {
  background: #fff;
  border-bottom: 1px solid #e4e4e4;
  box-sizing: border-box;
  height: 44px;
  line-height: 25px;
  padding: 10px;
}

.select-pure__option--selected {
  color: #e4e4e4;
  cursor: initial;
  pointer-events: none;
}

.select-pure__option--hidden {
  display: none;
}

.select-pure__selected-label {
  background: #5e6264;
  border-radius: 4px;
  color: #fff;
  cursor: initial;
  display: inline-block;
  margin: 5px 10px 5px 0;
  padding: 3px 7px;
}

.select-pure__selected-label:last-of-type {
  margin-right: 0;
}

.select-pure__selected-label i {
  cursor: pointer;
  display: inline-block;
  margin-left: 7px;
}

.select-pure__selected-label i:hover {
  color: #e4e4e4;
}

.select-pure__autocomplete {
  background: #f9f9f8;
  border-bottom: 1px solid #e4e4e4;
  border-left: none;
  border-right: none;
  border-top: none;
  box-sizing: border-box;
  font-size: 16px;
  outline: none;
  padding: 10px;
  width: 100%;
}

.select-pure__select {
        align-items: center;
        background: #f9f9f8;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        box-sizing: border-box;
        color: #363b3e;
        cursor: pointer;
        display: flex;
        font-size: 16px;
        font-weight: 500;
        justify-content: left;
        min-height: 44px;
        padding: 5px 10px;
        position: relative;
        transition: 0.2s;
        width: 100%;
      }

      .select-pure__options {
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.15);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
        box-sizing: border-box;
        color: #363b3e;
        display: none;
        left: 0;
        max-height: 221px;
        overflow-y: scroll;
        position: absolute;
        top: 50px;
        width: 100%;
        z-index: 5;
      }

      .select-pure__select--opened .select-pure__options {
        display: block;
      }

      .select-pure__option {
        background: #fff;
        border-bottom: 1px solid #e4e4e4;
        box-sizing: border-box;
        height: 44px;
        line-height: 25px;
        padding: 10px;
      }

      .select-pure__option--selected {
        color: #e4e4e4;
        cursor: initial;
        pointer-events: none;
      }

      .select-pure__option--hidden {
        display: none;
      }

      .select-pure__selected-label {
        background: #5e6264;
        border-radius: 4px;
        color: #fff;
        cursor: initial;
        display: inline-block;
        margin: 5px 10px 5px 0;
        padding: 3px 7px;
      }

      .select-pure__selected-label:last-of-type {
        margin-right: 0;
      }

      .select-pure__selected-label i {
        cursor: pointer;
        display: inline-block;
        margin-left: 7px;
      }

      .select-pure__selected-label i:hover {
        color: #e4e4e4;
      }

      .select-pure__autocomplete {
        background: #f9f9f8;
        border-bottom: 1px solid #e4e4e4;
        border-left: none;
        border-right: none;
        border-top: none;
        box-sizing: border-box;
        font-size: 16px;
        outline: none;
        padding: 10px;
        width: 100%;
      }

        .animatedSection {
            display: flex;
            justify-content: space-between;
            padding-right: 5em;
          }

          
        #colorinput {
            line-height: 70px;
            width: 50px;
            height: 30px;
            border-width: medium;
            border: solid;
        }

        #colorinput:focus {
            border-color: #5b7ad0;
            outline: none;
        }

        .colorDesc {
            padding-bottom: 10px;
        }

          h1 {
              margin-left: 28px;
              color: white;
          }

          form {
              padding-left: 28px;
          }

          form h3 {
              color: white;
          }

          .animatedSection .fieldName {
            color: white;
            font-size: 16px;
            font-weight: bold;
          }
          .animatedSection h4 {
            font-style: normal;
            line-height: 24px;
            font-size: 16px;
            font-weight: bold;
            margin-top: 32px;
            margin-bottom: 0;
          }
          .animatedSection p {
            font-size: 14px;
            color: grey;
          }
          .animatedSection input {
            padding-left: 0;
            width: 28em;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 33px;
            background: transparent;
            border-top: none;
            border-left: none;
            border-right: none;
            color: white;
            padding: 5px;
          }

          .animatedSection textarea {
            font-family: Arial;
            padding-left: 0;
            width: 28em;
            font-style: normal;
            font-weight: normal;
            font-size: 16px;
            line-height: 33px;
            background: transparent;
            border-top: none;
            border-left: none;
            border-right: none;
            color: white;
            padding: 5px;
          }

          .animatedSection input:focus{
            border-color: #5b7ad0;
            outline: none;
          }

          
          .animatedSection textarea:focus{
            border-color: #5b7ad0;
            outline: none;
          }
          
          #doneDiv {
            display: flex;
            justify-content: center;
            margin-bottom: 62px;
          }
          #doneDiv #doneButton {
            background: #3c3c3c;
            width: 97px;
            font-family: Poppins;
            font-style: normal;
            font-weight: 600;
            font-size: 14px;
            height: 44px;
            border-radius: 20px;
            border: none;
            margin-top: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
          }

          #rightSection {
            margin-top: 2em;
          }

          #advancedSection {
              display: none;
              animation-duration: 400ms;
              animation-name: slidein;
          }

          #advToggleSection {
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          #toggleSection {
            border: none;
            background: none;
            color: white;
            font-weight: bold;
            text-decoration: underline;
            outline: none;
            display: flex;
            align-items: center;
          }

          #saveForm {
            float: right;
            margin-right: 4em;
            background: linear-gradient(90deg,#1fc2c8,#9337d8 116%);
            color: white;
            border: none;
            padding: 1em;
            padding-left: 20px;
            padding-right: 20px;
            border-radius: 24px;
            font-weight: bold;
            width: 127px;
            border: none;
            cursor: pointer;
          }

          #chevronImg {
            width: 16px;
            margin-left: 5px;
          }

          #description {
            border-width: thick;
          }


          @keyframes slidein {
            from {
              transform: translateY(-80px);
              opacity: 0;
            }
          
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideOut {
            from {
                transform: translateY(0);
                opacity: 1;  
            }
          
            to {
                transform: translateY(-30px);
                opacity: 0;
            }
          }

          @keyframes rotateClockwise {
          from {
              transform: rotate(0 16 17);
            }
          to {
              transform: rotate(180 16 17);
            }
          }

          #chevronPath {
            animation-duration: 5s;
            animation-name: rotateClockwise; 
          }
          #displayList {
              display: None;
          }

          
        `;
  }

  firstUpdated() {
    console.log("First udpated");
    console.log(this.shadowRoot.querySelector(".example"));

    const myOptions = [

      {

        label: "New York",

        value: "NY",

      },

      {

        label: "Washington",

        value: "WA",

      },

      {

        label: "California",

        value: "CA",

      },

      {

        label: "New Jersey",

        value: "NJ",

      },

      {

        label: "North Carolina",

        value: "NC",

      },

    ];

    const element = this.shadowRoot.querySelector(".example");
    const containerEl = this.shadowRoot.querySelector(".animatedSection")

    let instance = new SelectPure(element, {
      options: myOptions,
      multiple: true,
      value: ['NY'],
      autocomplete: true,
      icon: 'remove'
      /*multiple: true,
      autocomplete: true*/
    }, this.shadowRoot.host);
  }

  toggleAdvancedSection() {
    var el = this.shadowRoot.querySelector('#advancedSection') as HTMLElement;
    var rotatePath = this.shadowRoot.querySelector('#chevronPath') as HTMLElement;


    // console.log(el.style.display);
    // if(rotatePath !== null) {
    //     rotatePath.style.animationName = 'rotateClockwise';
    //     rotatePath.style.animationDuration = '400ms';
    // }

    console.log(el.style.display);
    if (el !== null) {
      if (el.style.display !== 'block') {
        el.style.display = 'block';
        console.log('in the first');
        console.log(el);

      }
      else {
        el.style.animationDuration = '400ms';
        el.style.animationName = 'slideOut';
        setTimeout(() => {
          el.style.display = 'none';
          el.style.animationName = 'slidein';
          console.log('in the second');
          console.log(el);
        }, 220);




      }
    }
  }


  listener() {

  }
  onCategoryChange(categoryValue) {
    //console.log(this.nodeValue;
    //this.categories = categoryValue;
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
      console.log("This is the file path" + files[i].path);
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
    if (this.shortname.trim() === "") {
      this.shortname = this.name;
    }
  }

  onOrientationChange(orientationValue) {
    this.orientation = OrientationList[orientationValue].type;

  }

  onDescChange(descValue) {
    this.desc = descValue;
  }

  async submit() {
    var form = this.shadowRoot.querySelector("#manifestForm") as HTMLFormElement;

    //to-do make initial form data
    //console.log(this.shadowRoot.querySelector('#manifestForm'));
    //const testData: any = new FormData(this.shadowRoot.querySelector('#manifestForm'));
    var formData = new FormData();
    var fileField = this.shadowRoot.querySelector('#icon') as HTMLInputElement;

    // formData.append('username', 'abc123');
    formData.append('fileName', fileField.files[0]);
    formData.append('padding', '0.2');
    formData.append('platform', 'android');

    /*fetch('https://appimagegenerator-prod.azurewebsites.net/api/image', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error))
        .then(response =>  {
            console.log('Success:', JSON.stringify(response));
            icon = response.Uri;
        });*/

    const response = await fetch('https://appimagegenerator-prod.azurewebsites.net/api/image', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    icon = data.Uri;


    // testData.append('')
    if (this.shortname.trim() === "") {
      this.shortname = this.name;
    }


    sampleObject.description = this.desc;
    sampleObject.name = this.name;
    sampleObject.orientation = this.orientation;
    sampleObject.short_name = this.shortname;
    sampleObject.theme_color = this.color;
    sampleObject.background_color = this.color;
    sampleObject.categories = this.categories;

    sampleObject.start_url = this.start_url;
    (window as any).vscode.postMessage({
      name: 'manifest',
      JSONObject: sampleObject,
      icon: icon
    });


  }

  onCategoriesChange(categoriesValue) {
    if (categoriesValue.length >= 2) {

      this.items = ["Does", "This", "Work"];

      if (categoriesValue && categoriesValue.trim() !== '') {
        this.items = this.items.filter((item) => {
          return (item.toLowerCase().indexOf(categoriesValue.toLowerCase()) > -1);
        });
        console.log("These are the items", this.items);
        if (this.items.length > 0) {
          (this.shadowRoot.querySelector("#displayList") as HTMLElement).style.display = 'block';
        }
        else {
          (this.shadowRoot.querySelector("#displayList") as HTMLElement).style.display = 'none';
        }

      }

    }
    else {
      (this.shadowRoot.querySelector("#displayList") as HTMLElement).style.display = 'none';
    }
  }



  render() {
    return html`<h1><a>Manifest Generator</a></h1>
        
   <form enctype="multipart/form-data" method="post" id="manifestForm" name="manifestForm">
    <div>
        <h3>Fill out the following fields to generate your manifest file.</h3>
    </div>

    <ul class="animatedSection">
       <section id="leftSection">
        <div>
            <label class="fieldName">
                <h4>Name </h4>
            </label>

            <p> Used for App lists or Store listings </p>
            <div>
                <input id="name" name="name" type="text" placeholder="App Name" maxlength="255" value="" @change="${e => this.onNameChange(e.target.value)} " required>
            </div>
        </div>

        <div>
            <label class="fieldName">
                <h4>Short name</h4>
            </label>
            <p> Used for tiles or home screens </p>
            <div>
                <input id="shortname" name="short-name" type="text" placeholder="App Short Name" maxlength="255" value="${this.shortname}" @change="${e => this.onShortnameChange(e.target.value)}" required>
            </div>
        </div>

        <div>

            <label class="fieldName" for="description">
                <h4>Description</h4> </label>
            <p>Used for App listings </p>
            <div>
                <textarea id="description" name="description" placeholder="App Description"  @change="${e => this.onDescChange(e.target.value)}" required>${this.desc}</textarea>
            </div>
        </div>

        </section>

        <section id="rightSection">

      

        <div>
            <div class="colorlabel">
                <label class="fieldName" for="color">Color </label>
            </div>
            <p class="colorDesc"> Select the background color for your splash screen and tile </p>
            <div>
                <input type="color" id="colorinput" value="${this.color}" @change="${e => this.onColorChange(e.target.value)}">
            </div>
        </div>

        <div>
            <label class="fieldName">
                <h4>Upload an Icon</h4> </label>
            <p> We suggest at least one image 512×512 or larger </p>
            <div>
                <input id="icon" name="fileName" type="file" accept="image/*" class="inputfile" @change="${e => this.onIconSelection(e.target.value)}" />
            </div>
        </div>

        </section>

    </ul>

  
                      
    <section id="advancedSection">
    <ul class="animatedSection">
       <section id="leftSection">
    <div>
            <label class="fieldName">Upload Screenshots</label>
            <p>We suggest at least one image 512×512 or larger</p>
            <div>
                <input id="screenshot" type="file" accept="image/*" class="inputfile"  @change="${e => this.onScreenshotSelection()}" multiple />
            </div>
        </div>
        <div>
            <label class="fieldName">
                <h4>Language</h4></label>
                <p>Declare the language of your PWA</p>
            <div>
                <select id="language" name="language" @change="${e => this.onLanguageChange(e.target.value)}">

                    ${this.languageData.map((i) => html`
                    <option value=${JSON.stringify(i)}>${i.name} `)}</option>

                </select>
            </div>
        </div>

        <div>
            <label class="fieldName">
                <h4>Orientation</h4> </label>
                <p>Orientation determines the perfered flow of your application.</p>
            <div>
                <select id="orientation" name="orientation" @change="${e => this.onOrientationChange(e.target.value)}">
                    ${OrientationList.map((i) => html`
                    <option value=${i.id} @click=${() =>
        this.onOrientationChange(i.id)}>${i.type} `)}

                </select>
            </div>
        </div>
       </section>
       <section id="rightSection">
        <div>

            <label class="fieldName">Category </label>
            <div>
                <span class="example"></span>
                <!--<textarea id="categories" name="categories" @keyup="${e => this.onCategoriesChange(e.target.value)}" required>Uhh</textarea>-->
                <!-- <input id="category" name="category" type="text" maxlength="255" value="${this.categories}" @change="${e => this.onCategoryChange(e)}"> -->
               <!-- <div id="displayList">
                    <ul id="categoriesList">
                    ${this.items.map((i) => html`
                        <li value=${i}>${i} `)}
                    </ul>
        
                </div>
                </span>-->
            </div>        
            </div>
        </div>

        <div>
            <label class="fieldName">Start Url </label>
            <p>This will be the first page that loads in your PWA.</p>
            <div>
                <input id="start_url" name="start_url" type="text" maxlength="255" value="${this.start_url}" @change="${e => this.onStartUrlChange(e.target.value)}">
            </div>
        </div>
       </section>
        </ul>
        </section>
        
</form>

<div id="advToggleSection">
  <button id="toggleSection" @click="${() => this.toggleAdvancedSection()}">
    Advanced 

    <!--<img src="/assets/chevron.svg">-->

    <svg id="chevronImg" width="32" height="33" viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="17" r="16" transform="rotate(-180 16 17)" fill="#5b7ad0" fill-opacity="0.4"/>
      <path id="chevronPath" d="M15.5352 21.668C15.6719 21.8047 15.8359 21.8867 16 21.8867C16.1914 21.8867 16.3555 21.8047 16.4648 21.668L21.7695 16.3633C21.9063 16.2266 21.9609 16.0625 21.9609 15.8984C21.9609 15.707 21.9063 15.543 21.7695 15.4336L21.168 14.832C21.0586 14.6953 20.8945 14.6133 20.7031 14.6133C20.5391 14.6133 20.375 14.668 20.2383 14.8047L16 19.043L11.7617 14.8047C11.6523 14.668 11.4883 14.6133 11.2969 14.6133C11.1328 14.6133 10.9688 14.6953 10.832 14.832L10.2305 15.4336C10.1211 15.543 10.0391 15.707 10.0391 15.8984C10.0391 16.0625 10.1211 16.2266 10.2305 16.3633L15.5352 21.668Z" fill="white"/>
    </svg>
 </button>
</div>

<input id="saveForm" type="submit" name="submit" value="Generate" form="manifestForm" @click=${() => this.submit()}/>
        `;


  }
}



