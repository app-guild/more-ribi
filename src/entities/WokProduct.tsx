import {ProductType} from "./ProductType";
import Product from "./Product";

export default class WokProduct extends Product {
    constructor(
        protected _name: string,
        protected _type: ProductType,
        protected _price: number,
        protected _discountPrice: number | undefined,
        protected _available: boolean,
        protected _image: string,
        protected _composition: string,
        protected _base: string,
        protected _sauce: string,
    ) {
        super(_name, _type, _price, _discountPrice, _available, _image, _composition);
        this._id = this._type + "_" + this._name + "_" + this._base + "_" + this._sauce;
    }

    get base(): string {
        return this._base;
    }

    get sauce(): string {
        return this._sauce;
    }

    static parseDatabaseJson(json: any): WokProduct {
        return new WokProduct(
            json.name,
            ProductType.parse(json.type),
            json.price,
            json.discountPrice,
            !!json.available,
            json.image,
            json.composition,
            json.base,
            json.sauce,
        );
    }
}
