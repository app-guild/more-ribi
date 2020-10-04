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
