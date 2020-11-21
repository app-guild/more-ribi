export default class InstagramPost {
    constructor(private _link: string, private _text: string, private _imageUrl: string, private _date: number) {}

    get link(): string {
        return this._link;
    }

    get text(): string {
        return this._text;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    get date(): number {
        return this._date;
    }

    static parseRealtimeDatabaseJson(json: any, date: string): InstagramPost {
        return new InstagramPost(json.linkToRecord, json.text, json.mediaUrl, Date.parse(date.split("+")[0]));
    }
}
