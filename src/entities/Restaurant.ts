import {Json} from "../utils/database/DatabaseApi";

export default class Restaurant {
    constructor(private _address: string, private _phone: string) {}

    get address(): string {
        return this._address;
    }

    get phone(): string {
        return this._phone;
    }

    static parseRealtimeDatabaseJson(json: Json): Restaurant {
        return new Restaurant(json.address, json.phone);
    }
}
