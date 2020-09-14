import Product from "./Product";
import {TKey} from "../database/DatabaseApi";

export default class Cart {
    private _totalPrice: number;

    constructor(
        protected _id: TKey,
        protected _products: Product[],
    ) {
        this._totalPrice = this.countTotalPrice(this._products);
    }

    private countTotalPrice(products: Product[]): number {
        let totalPrice = 0;
        products.forEach((product) => {
            const discountPrice = product.discountPrice;
            totalPrice += discountPrice !== null ? discountPrice : product.price;
        });
        return totalPrice;
    }

    get products() {
        return this._products;
    }

    get totalPrice() {
        return this._totalPrice;
    }

    get id(): TKey {
        return this._id;
    }
}
