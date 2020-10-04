import Cart from "./Cart";
import {Json, TKey} from "../utils/database/DatabaseApi";
import Product from "./Product";
import Address from "./Address";

export default class Order extends Cart {
    constructor(
        id: TKey,
        products: Map<Product, number>,
        private _date: Date,
        private _address: Address,
        private _comment: string,
        private _paymentMethod: string,
    ) {
        super(id, products);
    }

    // @ts-ignore
    get products(): Map<Product, number> {
        return this._products;
    }

    get date(): Date {
        return this._date;
    }

    get address(): Address {
        return this._address;
    }

    get comment(): string {
        return this._comment;
    }

    get paymentMethod(): string {
        return this._paymentMethod;
    }

    static parseDatabaseResponse(response: Json, products: Map<Product, number>): Order {
        return new Order(
            response.id,
            products,
            new Date(response.date * 1000),
            JSON.parse(response.address),
            response.comment,
            response.paymentMethod,
        );
    }
}
