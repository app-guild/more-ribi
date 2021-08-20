import {Json} from "../utils/database/DatabaseApi";

interface IPosition {
    longitude: number;
    latitude: number;
}

export default class Restaurant {
    constructor(private _address: string, private _phone: string, private _position: IPosition) {}

    get address(): string {
        return this._address;
    }

    get phone(): string {
        return this._phone;
    }

    get position(): IPosition {
        return this._position;
    }

    static parseRealtimeDatabaseJson(json: Json): Restaurant {
        return new Restaurant(
            json.address,
            json.phone,
            { longitude: json.longitude, latitude: json.latitude },
        );
    }
}
