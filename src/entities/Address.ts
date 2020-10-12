import {Json} from "../utils/database/DatabaseApi";

export default class Address {
    constructor(
        public _mainAddress: string = "",
        public _entrance: string = "",
        public _flor: string = "",
        public _apartment: string = "",
    ) {}

    public toString(): string {
        let result = "";
        if (this.mainAddress) {
            result = result + `${this.mainAddress}`;
        }
        if (this.entrance) {
            result = result + `, подъезд №${this.entrance}`;
        }
        if (this.flor) {
            result = result + `, ${this.flor} этаж`;
        }
        if (this.apartment) {
            result = result + `, квартира/офис №${this.apartment}`;
        }
        return result;
    }

    get mainAddress(): string {
        return this._mainAddress;
    }

    set mainAddress(value: string) {
        this._mainAddress = value;
    }

    get entrance(): string {
        return this._entrance;
    }

    set entrance(value: string) {
        this._entrance = value;
    }

    get flor(): string {
        return this._flor;
    }

    set flor(value: string) {
        this._flor = value;
    }

    get apartment(): string {
        return this._apartment;
    }

    set apartment(value: string) {
        this._apartment = value;
    }

    static parseDatabaseAddress(address: Json): Address {
        let addres = new Address(address._mainAddress, address._entrance, address._flor, address._apartment);
        return addres;
    }
}
