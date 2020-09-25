import {ProductType} from "./ProductType";

export default class Product {
    private readonly _id: string;

    constructor(
        private _name: string,
        private _type: ProductType,
        private _price: number,
        private _discountPrice: number | undefined,
        private _available: boolean,
        private _image: string,
        private _composition: string,
    ) {
        this._id = this._type + this._name;
    }

    get id(): string {
        return this._id;
    }

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

    get discountPrice(): number | undefined {
        return this._discountPrice;
    }

    get composition(): string {
        return this._composition;
    }

    toObject(): object {
        return {
            name: this._name,
            type: this._type,
            price: this._price,
            discountPrice: this._discountPrice,
            composition: this._composition,
            image: this.image,
            available: this._available,
        };
    }

    static parseDatabaseJson(json: any): Product {
        return new Product(
            json.name,
            ProductType.parse(json.type),
            json.price,
            json.discountPrice,
            !!json.available,
            json.image,
            json.composition,
        );
    }

    static parseRealtimeDatabaseJson(json: any, productType: ProductType): Product {
        return new Product(
            json.name,
            productType,
            json.price,
            json.discountPrice, // TODO уточнить чему равно
            json.available !== false,
            json.image,
            json.composition, // TODO уточнить чему равно
        );
    }
}
