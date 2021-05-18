import RealtimeDatabaseApi from "./RealtimeDatabaseApi";
import Post from "../../entities/Post";

export default class PageNewsLoader {
    private _currentPage: number;
    private _pagesOut: boolean = false;
    private _posts?: Post[];

    constructor(private _pageSize: number, startPage?: number) {
        this._currentPage = startPage || 0;
    }

    async getNextPage(): Promise<Post[]> {
        if (!this._posts) {
            this._posts = await RealtimeDatabaseApi.getPosts();
            this._posts = this._posts.sort((a, b) => b.date - a.date);
        }
        const start = this._currentPage * this._pageSize;
        this._currentPage++;
        let limit = this._currentPage * this._pageSize;
        if (!this._pagesOut) {
            if (limit > this._posts.length) {
                this._pagesOut = true;
                limit = this._posts.length;
            }
            return this._posts.slice(start, limit);
        } else {
            return [];
        }
    }

    get pagesOut(): boolean {
        return this._pagesOut;
    }
}
