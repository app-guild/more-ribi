import Product from "./Product";
import {TKey} from "../database/DatabaseApi";

export default class Cart {
    private _products: Product[];
    private _totalPrice: number;
    private _id: TKey;

    constructor(id: TKey, products: Product[]) {
        this._id = id;
        this._products = products;
        this._totalPrice = this.countTotalPrice(products);
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

    static parseDatabaseResponse(response: string): Cart {
        return new Cart([]);
    }
}
