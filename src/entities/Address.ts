export default class Address {
    constructor(
        private _street: string = "",
        private _buildingNumber: string = "",
        private _entrance: string = "",
        private _flor: string = "",
        private _apartment: string = "",
    ) {}

    toString(): string {
        let result = `${this.street}, дом №${this.buildingNumber}`;
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
