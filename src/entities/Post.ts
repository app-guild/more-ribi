export default class Post {
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

    static parseRealtimeDatabaseJson(json: any): Post {
        return new Post(json.linkToRecord, json.text, json.mediaUrl, Date.parse(json.date));
    }
}
