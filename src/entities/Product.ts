import {ProductType} from "./ProductType";

export default class Product {
    protected _id: string;

    constructor(
        protected _name: string,
        protected _type: ProductType,
        protected _price: number,
        protected _discountPrice: number | undefined,
        protected _available: boolean,
        protected _image: string,
        protected _composition: string,
    ) {
        this._id = this._type + "_" + this._name;
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

    get available(): boolean {
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
            json.discountPrice,
            json.available !== false,
            json.image,
            json.composition,
        );
    }
}
