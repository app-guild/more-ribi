import Product from "./Product";
import {TKey} from "../utils/database/DatabaseApi";

export default class Cart {
    private _totalPrice: number;

    constructor(protected _id: TKey, protected _products: Product[]) {
        this._totalPrice = this.countTotalPrice(this._products);
    }

    private countTotalPrice(products: Product[]): number {
        let totalPrice = 0;
        products.forEach((product) => {
            let price = product.price;
            if (product.discountPrice) {
                price = product.discountPrice;
            }
            totalPrice = totalPrice + price;
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
