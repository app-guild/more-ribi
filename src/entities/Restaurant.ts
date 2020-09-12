import {Json, TKey} from "../database/DatabaseApi";

export default class Restaurant {
    constructor(
        private _id: TKey,
        private _address: string,
        private _phone: string,
    ) {}

    get id(): TKey {
        return this._id;
    }

    get address(): string {
        return this._address;
    }

    get phone(): string {
        return this._phone;
    }

    static parseDatabaseJson(json: Json): Restaurant {
        return new Restaurant(
            json.id,
            json.address,
            json.phone,
        );
    }
}
