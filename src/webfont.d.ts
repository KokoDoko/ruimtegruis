// allow use of WebFont.load in typescript

declare namespace google.fonts {
    interface WebFont {
        load(o:any):void // hack
    }

    interface WebfontList {
        kind: string;
        items: WebfontFamily[];
    }

    interface WebfontFamily {
        category?: string;
        kind: string;
        family: string;
        subsets: string[];
        variants: string[];
        version: string;
        lastModified: string;
        files: { [variant: string]: string };
    }
}

declare var WebFont: google.fonts.WebFont;