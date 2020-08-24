import {InstagramPost} from "./InstagramPost";

export class InstagramUser {
    private _username: string;
    private _url: string;
    private _bio: string;
    private _followersCount: number;
    private _followingCount: number;
    private _postsCount: number;
    private _posts: InstagramPost[];
    private _profilePicThumb: string;
    private _profilePicHD: string;

    constructor(username: string) {
        this._username = username;
        this._url = `https://www.instagram.com/${username}`;
        this._bio = "";
        this._followersCount = 0;
        this._followingCount = 0;
        this._postsCount = 0;
        this._posts = [];
        this._profilePicThumb = "";
        this._profilePicHD = "";
    }
    async fetchData(): Promise<InstagramUser> {
        if (!this._username) {
            return Promise.reject("Username can't be empty");
        }
        // @ts-ignore
        return fetch(`${this._url}/?__a=1`)
            .then((response) => response.json())
            .then((jsonData) => {
                const userInfo = jsonData.graphql.user;
                this._bio = userInfo.biography;
                this._followingCount = userInfo.edge_follow.count;
                this._followersCount = userInfo.edge_followed_by.count;
                this._profilePicHD = userInfo.profile_pic_url_hd;
                this._profilePicThumb = userInfo.profile_pic_url;
                const postData = userInfo.edge_owner_to_timeline_media;
                const posts = userInfo.edge_owner_to_timeline_media.edges;
                this._postsCount = postData.count;
                for (let i = 0; i < posts.length; i++) {
                    let data = posts[i].node;
                    const imageData = {
                        url: data.display_url,
                        height: data.dimensions.height,
                        width: data.dimensions.width,
                    };
                    const likesCount = data.edge_liked_by.count;
                    const url = `https://instagram.com/p/${data.shortcode}`;
                    const edges = data.edge_media_to_caption.edges;
                    const postText =
                        edges.length > 0 ? edges[0].node.text : null;
                    const date = new Date(data.taken_at_timestamp * 1000);
                    const post = new InstagramPost(
                        date,
                        postText,
                        imageData,
                        url,
                        likesCount,
                    );
                    this._posts.push(post);
                }
                return this;
            });
    }

    get username(): string {
        return this._username;
    }

    get url(): string {
        return this._url;
    }

    get bio(): string {
        return this._bio;
    }

    get followersCount(): number {
        return this._followersCount;
    }

    get followingCount(): number {
        return this._followingCount;
    }

    get postsCount(): number {
        return this._postsCount;
    }

    get posts(): InstagramPost[] {
        return this._posts;
    }

    get profilePicThumb(): string {
        return this._profilePicThumb;
    }

    get profilePicHD(): string {
        return this._profilePicHD;
    }
}
