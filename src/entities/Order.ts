import Cart from "./Cart";
import {Json, TKey} from "../utils/database/DatabaseApi";
import Product from "./Product";

export default class Order extends Cart {
    constructor(
        id: TKey,
        products: Product[],
        private _date: Date,
        private _address: string,
        private _comment: string,
    ) {
        super(id, products);
    }

    get date(): Date {
        return this._date;
    }

    get address(): string {
        return this._address;
    }

    get comment(): string {
        return this._comment;
    }

    static parseDatabaseResponse(response: Json, products: Product[]): Order {
        return new Order(
            response.order_id,
            products,
            new Date(response.date * 1000),
            response.address,
            response.comment,
        );
    }
}
