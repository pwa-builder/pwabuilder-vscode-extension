//Manifest Items




export const OrientationList : { id: number, type: string }[] = [
    { "id": 0, "type": "Portrait" },
    { "id": 1, "type": "Landscape" },
];


export class Icon {
    src: string;
    sizes: string;
    type: string;
}

export class Screenshot {
    src: string;
    sizes: string;
    type: string;
}



export class ManifestInfo {
    name: string;
    short_name: string;
    description: string;
    icons: Icon[];
    orientation: string;
    lang: string = "en";
    dir: string = "ltr";
    theme_color: string;
    background_color: string;
    screenshots: Screenshot[];
    categories: string;
    start_url: string;
    display: string = "standalone";

}