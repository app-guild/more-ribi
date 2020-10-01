export default class InstagramPost {
    constructor(private _text: string, private _imageUrl: string) {}

    get text(): string {
        return this._text;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    static parseDatabaseJson(json: any): InstagramPost {
        return new InstagramPost(json.text, json.mediaUrl);
    }
}
