import {ImageData} from "./ImageData";

export class News {
    protected _image: ImageData | null;
    protected _text: string | null;
    protected _date: Date;

    constructor(date: Date, text: string | null, image: ImageData | null) {
        this._image = image;
        this._text = text;
        this._date = date;
    }

    get image(): ImageData | null {
        return this._image;
    }

    get text(): string | null {
        return this._text;
    }

    get date(): Date {
        return this._date;
    }
}
