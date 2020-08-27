import {News} from "./News";
import {ImageData} from "./ImageData";

export class InstagramPost extends News {
    private _postUrl: string;
    private _likesCount: number;

    constructor(
        date: Date,
        text: string | null,
        image: ImageData,
        postUrl: string,
        likesCount: number,
    ) {
        super(date, text, image);
        this._postUrl = postUrl;
        this._likesCount = likesCount;
    }

    get postUrl(): string {
        return this._postUrl;
    }

    get likesCount(): number {
        return this._likesCount;
    }
}
