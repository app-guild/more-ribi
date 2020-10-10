import SQLite from "react-native-sqlite-storage";
import Product from "../../entities/Product";
import Cart from "../../entities/Cart";
import Order from "../../entities/Order";
import WokProduct from "../../entities/WokProduct";
import {ProductType} from "../../entities/ProductType";

SQLite.DEBUG = true;

export type TKey = string | number;

export type Json = any;

interface IRows {
    length: number;
    raw: () => Json[];
    item: () => any; // TODO не понял что такое
}

interface IResults {
    rows: IRows;
    rowsAffected: number;
    insertId?: TKey;
}

export default class DatabaseApi {
    private static onCartChangeListeners: Array<(cart: Cart) => void> = [];
    private static onOrdersChangeListeners: Array<(orders: Order[]) => void> = [];
    private static cart: Cart | null = null;
    private static getCartPromise: Promise<Cart> | null = null;

    static addOnCartChangeListener(listener: (cart: Cart) => void) {
        DatabaseApi.onCartChangeListeners.push(listener);
    }

    static removeOnCartChangeListener(listener: (cart: Cart) => void) {
        const index = DatabaseApi.onCartChangeListeners.indexOf(listener);
        if (index !== undefined) {
            DatabaseApi.onCartChangeListeners.splice(index, 1);
        }
    }

    private static callOnCartChangeListeners(cart: Cart): void {
        DatabaseApi.onCartChangeListeners.forEach((listener) => {
            listener(cart);
        });
    }

    static addOnOrdersChangeListener(listener: (orders: Order[]) => void) {
        DatabaseApi.onOrdersChangeListeners.push(listener);
    }

    static removeOnOrdersChangeListener(listener: (orders: Order[]) => void) {
        const index = DatabaseApi.onOrdersChangeListeners.indexOf(listener);
        if (index !== undefined) {
            DatabaseApi.onOrdersChangeListeners.splice(index, 1);
        }
    }

    private static callOnOrdersChangeListeners(orders: Order[]): void {
        DatabaseApi.onOrdersChangeListeners.forEach((listener) => {
            listener(orders);
        });
    }

    /**
     * Get user orders with products
     * @return {Promise<Order>} Promise contains order
     */
    static getOrders(): Promise<Order[]> {
        const sql = `SELECT * FROM Orders WHERE date IS NOT NULL`;

        return DatabaseApi.executeQuery(sql).then((results) => {
            const rawData = results.rows.raw();
            return rawData.map((json) => {
                const products = DatabaseApi.parseProducts(json.products);
                return Order.parseDatabaseResponse(json, products);
            });
        });
    }

    static async removeUnavailableProductsFromCart(): Promise<Product[]> {
        return DatabaseApi.getCart().then((cart) => {
            const unavailable = cart.popUnavailableProducts();
            return DatabaseApi.updateProductsInCart(cart).then(() => unavailable);
        });
    }

    // region Cart

    /**
     * Get cart with all products
     * @return {Promise<Cart>} Promise contains cart
     */
    static getCart(): Promise<Cart> {
        if (DatabaseApi.cart) {
            return Promise.resolve(DatabaseApi.cart);
        } else {
            if (DatabaseApi.getCartPromise) {
                return DatabaseApi.getCartPromise;
            }

            const sql = `
                SELECT * FROM Orders 
                WHERE date IS NULL
            `;

            this.getCartPromise = DatabaseApi.executeQuery(sql).then((results) => {
                const rawData = results.rows.raw();
                const cartJson = rawData[0];
                const productMap = DatabaseApi.parseProducts(cartJson.products);

                DatabaseApi.cart = new Cart(cartJson.id, productMap);
                DatabaseApi.getCartPromise = null;
                return DatabaseApi.cart;
            });
            return DatabaseApi.getCartPromise;
        }
    }

    /**
     * Add product to cart and return new cart price
     * @param {Product} product
     * @param {number} count
     * @void
     */
    static addProductToCart(product: Product, count?: number): Promise<void> {
        return DatabaseApi.getCart().then((cart) => {
            cart.addProduct(product, count);
            return DatabaseApi.updateProductsInCart(cart);
        });
    }

    /**
     * Add product to cart and return new cart price
     * @param {Product} product
     * @param {number} count New count of product
     * @void
     */
    static updateProductCount(product: Product, count: number): Promise<void> {
        return DatabaseApi.getCart().then((cart) => {
            cart.updateCount(product, count);
            return DatabaseApi.updateProductsInCart(cart);
        });
    }

    /**
     * Remove product from cart and return new cart price
     * @param {Product} product
     * @void
     */
    static removeProductFromCart(product: Product): Promise<void> {
        return DatabaseApi.getCart().then((cart) => {
            cart.removeProduct(product);
            return DatabaseApi.updateProductsInCart(cart);
        });
    }

    /**
     * Remove all products from cart and return new cart price
     * @remark After clear cart price is 0
     * @void
     */
    static clearCart(): Promise<void> {
        return DatabaseApi.getCart().then((cart) => {
            cart.clear();
            return DatabaseApi.updateProductsInCart(cart);
        });
    }

    /**
     * Create order from cart and create new cart
     * @void
     */
    static createOrderFromCart(address: string, comment: string, paymentMethod: string): Promise<Cart> {
        return DatabaseApi.getCart()
            .then((cart) => {
                const sql = `
                    UPDATE Orders SET 
                        date=${Date.now()}, 
                        address='${address}',
                        comment='${comment}',
                        paymentMethod='${paymentMethod}' 
                    WHERE id=${cart.id};
                `;
                return sql;
            })
            .then(DatabaseApi.executeQuery)
            .then(() => {
                DatabaseApi.cart = null;
                DatabaseApi.getCartPromise = null;
            })
            .then(() => DatabaseApi.getOrders())
            .then((orders) => DatabaseApi.callOnOrdersChangeListeners(orders))
            .then(() => DatabaseApi.createCart());
    }

    static updateProductsInCart(cart: Cart): Promise<void> {
        const sql = `UPDATE Orders SET products='${cart.getJsonProducts()}' WHERE id = ${cart.id}`;
        return DatabaseApi.executeQuery(sql).then(() => DatabaseApi.callOnCartChangeListeners(cart));
    }

    // endregion

    /**
     * Parse products from order.
     * @param json
     * @return {Map<Product, number>} map where for each product contains count this product.
     * @private
     */
    private static parseProducts(json: any): Map<Product, number> {
        if (!json) {
            return new Map<Product, number>();
        }

        const jsonProducts = JSON.parse(json);
        const result = new Map();
        jsonProducts
            .filter((it: any) => it.count && !isNaN(Number(it.count)))
            .forEach((it: any) =>
                result.set(
                    it.type === ProductType.Wok ? WokProduct.parseDatabaseJson(it) : Product.parseDatabaseJson(it),
                    Number(it.count),
                ),
            );
        return result;
    }

    private static createCart(): Promise<Cart> {
        const sql = `INSERT INTO Orders DEFAULT VALUES;`;

        return DatabaseApi.executeQuery(sql)
            .then(DatabaseApi.getCart)
            .then((cart) => {
                DatabaseApi.callOnCartChangeListeners(cart);
                return cart;
            });
    }

    /**
     * Execute sql queries
     * @param sql
     * @returns {Promise} results
     */
    private static executeQuery(sql: string): Promise<IResults> {
        return new Promise((resolve, reject) => {
            global.db.transaction((trans: any) => {
                trans.executeSql(
                    sql,
                    [],
                    (trans: any, results: IResults) => {
                        resolve(results);
                    },
                    (error: any) => {
                        reject(error);
                    },
                );
            });
        });
    }
}
