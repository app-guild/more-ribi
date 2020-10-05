export default class Address {
    constructor(
        private _street: string = "",
        private _buildingNumber: string = "",
        private _entrance: string = "",
        private _flor: string = "",
        private _apartment: string = "",
    ) {}

    public static print(address: Address): string {
        let result = "";
        if (address.street) {
            result = result + `${address.street}`;
        }
        if (address.buildingNumber) {
            result = result + `, дом №${address.buildingNumber}`;
        }
        if (address.entrance) {
            result = result + `, подъезд №${address.entrance}`;
        }
        if (address.flor) {
            result = result + `, ${address.flor} этаж`;
        }
        if (address.apartment) {
            result = result + `, квартира/офис №${address.apartment}`;
        }
        return result;
    }

    get street(): string {
        return this._street;
    }

    set street(value: string) {
        this._street = value;
    }

    get buildingNumber(): string {
        return this._buildingNumber;
    }

    set buildingNumber(value: string) {
        this._buildingNumber = value;
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
}
