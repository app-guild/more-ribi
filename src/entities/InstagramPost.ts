export default class InstagramPost {
    constructor(private _link: string, private _text: string, private _imageUrl: string) {}

    get link(): string {
        return this._link;
    }

    get text(): string {
        return this._text;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    static parseRealtimeDatabaseJson(json: any): InstagramPost {
        return new InstagramPost(json.linkToRecord, json.text, json.mediaUrl);
    }
}
