import database from "@react-native-firebase/database";
import RealtimeDatabaseApi from "./RealtimeDatabaseApi";
import InstagramPost from "../../entities/InstagramPost";

export default class PageNewsLoader {
    private _currentPage: number;
    private _pagesOut: boolean = false;
    constructor(private _pageSize: number, startPage?: number) {
        this._currentPage = startPage || 0;
    }

    getNextPage(): Promise<InstagramPost[]> {
        const start = this._currentPage * this._pageSize;
        this._currentPage++;
        const limit = this._currentPage * this._pageSize;
        return this._pagesOut ? Promise.resolve([]) : this._getNews(start, limit);
    }

    private _getNews(start: number, limit: number): Promise<InstagramPost[]> {
        return database()
            .ref("/instagram")
            .orderByKey()
            .limitToFirst(limit)
            .once("value")
            .then((snapshot) => {
                const posts = RealtimeDatabaseApi.parseInstagramPosts(snapshot.val());
                const currentPagePosts = posts.slice(start);

                if (!currentPagePosts.length) {
                    this._pagesOut = true;
                }

                return currentPagePosts;
            });
    }
}
