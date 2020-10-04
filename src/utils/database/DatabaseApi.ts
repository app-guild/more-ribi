import SQLite from "react-native-sqlite-storage";
import Product from "../../entities/Product";
import Cart from "../../entities/Cart";
import Order from "../../entities/Order";

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
    private static cart: Cart | null = null;
    private static getCartPromise: Promise<Cart> | null = null;

    static addOnCartChangeListener(listener: (cart: Cart) => void) {
        this.onCartChangeListeners.push(listener);
    }

    static removeOnCartChangeListener(listener: (cart: Cart) => void) {
        const index = this.onCartChangeListeners.indexOf(listener);
        if (index !== undefined) {
            this.onCartChangeListeners.splice(index, 1);
        }
    }

    /**
     * Get user orders with products
     * @return {Promise<Order>} Promise contains order
     */
    static getOrders(): Promise<Order[]> {
        const sql = `SELECT * FROM Orders WHERE date IS NOT NULL`;

        return this.executeQuery(sql).then((results) => {
            const rawData = results.rows.raw();
            return rawData.map((json) => {
                const products = this.parseProducts(json.products);
                return Order.parseDatabaseResponse(json, products);
            });
        });
    }

    // region Cart

    /**
     * Get cart with all products
     * @return {Promise<Cart>} Promise contains cart
     */
    static getCart(): Promise<Cart> {
        let sql = `
            SELECT * FROM Orders 
            WHERE date IS NULL
        `;

        if (this.cart) {
            return Promise.resolve(this.cart);
        } else {
            if (this.getCartPromise) {
                return this.getCartPromise;
            }

            this.getCartPromise = this.executeQuery(sql)
                .then((results) => {
                    const rawData = results.rows.raw();
                    if (!rawData.length) {
                        return this.createCart();
                    }

                    const cartJson = rawData[0];
                    const productMap = this.parseProducts(cartJson.products);

                    return new Cart(cartJson.id, productMap);
                })
                .then((cart) => {
                    this.cart = cart;
                    this.getCartPromise = null;
                    return this.cart;
                });
            return this.getCartPromise;
        }
    }

    /**
     * Add product to cart and return new cart price
     * @param {Product} product
     * @void
     */
    static addProductToCart(product: Product, count?: number): Promise<void> {
        return this.getCart().then((cart) => {
            cart.addProduct(product, count);
            return this.updateProducts(cart);
        });
    }

    /**
     * Add product to cart and return new cart price
     * @param {Product} product
     * @param {number} count New count of product
     * @void
     */
    static updateProductCount(product: Product, count: number): Promise<void> {
        return this.getCart().then((cart) => {
            cart.updateCount(product, count);
            return this.updateProducts(cart);
        });
    }

    /**
     * Remove product from cart and return new cart price
     * @param {Product} product
     * @void
     */
    static removeProductFromCart(product: Product): Promise<void> {
        return this.getCart().then((cart) => {
            cart.removeProduct(product);
            return this.updateProducts(cart);
        });
    }

    /**
     * Remove all products from cart and return new cart price
     * @remark After clear cart price is 0
     * @void
     */
    static clearCart(): Promise<void> {
        return this.getCart().then((cart) => {
            cart.clear();
            return this.updateProducts(cart);
        });
    }

    /**
     * Create order from cart and create new cart
     * @void
     */
    static createOrderFromCart(address: string, comment: string, paymentMethod: string): Promise<Cart> {
        return this.getCart().then((cart) => {
            const sql = `
                UPDATE Orders SET 
                    date=datetime('now','localtime'), 
                    address=${address},
                    comment=${comment},
                    paymentMethod=${paymentMethod} 
                WHERE id=${cart.id};
            `;
            return this.executeQuery(sql).then(() => this.createCart());
        });
    }

    // endregion

    private static updateProducts(cart: Cart): Promise<void> {
        const sql = `UPDATE Orders SET products='${cart.getJsonProducts()}' WHERE id = ${cart.id}`;
        return this.executeQuery(sql).then(() => this.callOnCartChangeListeners(cart));
    }

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
            .filter((it) => it.count && !isNaN(Number(it.count)))
            .forEach((it) => result.set(Product.parseDatabaseJson(it), Number(it.count)));
        return result;
    }

    private static createCart(): Promise<Cart> {
        const sql = `
            INSERT INTO Orders DEFAULT VALUES;
            SELECT * FROM Orders WHERE date IS NULL       
        `;

        return this.executeQuery(sql)
            .then((key) => new Cart(key.rows.raw()[0]?.id, new Map()))
            .then((cart) => {
                this.callOnCartChangeListeners(cart);
                return cart;
            });
    }

    private static callOnCartChangeListeners(cart: Cart): void {
        this.onCartChangeListeners.forEach((listener) => {
            listener(cart);
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
