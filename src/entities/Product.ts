import {ProductType} from "./ProductType";

export default class Product {
    constructor(
        private _name: string,
        private _type: ProductType,
        private _price: number,
        private _discountPrice: number | null,
        private _available: boolean,
        private _image: string,
        private _composition: string,
    ) {}

    get name(): string {
        return this._name;
    }

    get type(): ProductType {
        return this._type;
    }

    get isAvailable(): boolean {
        return this._available;
    }

    get image(): string {
        return this._image;
    }

    get price(): number {
        return this._price;
    }

    get discountPrice(): number | null {
        return this._discountPrice;
    }

    get composition(): string {
        return this._composition;
    }

    static parseRealtimeDatabaseJson(json: any): Product {
        return new Product(
            json.name,
            ProductType.None,
            json.price,
            json.discountPrice, // TODO уточнить чему равно
            json.available !== false,
            json.image,
            json.composition, // TODO уточнить чему равно
        );
    }
}
