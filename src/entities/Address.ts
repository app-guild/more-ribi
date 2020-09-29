export default class Address {
    constructor(
        private _street: string,
        private _buildingNumber: string,
        private _entrance?: string,
        private _flor?: string,
        private _apartment?: string,
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

    get buildingNumber(): string {
        return this._buildingNumber;
    }

    get entrance(): string | undefined {
        return this._entrance;
    }

    get flor(): string | undefined {
        return this._flor;
    }

    get apartment(): string | undefined {
        return this._apartment;
    }
}
