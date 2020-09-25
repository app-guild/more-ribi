import SQLite from "react-native-sqlite-storage";
import Product from "../../entities/Product";
import Cart from "../../entities/Cart";
import Order from "../../entities/Order";
import Restaurant from "../../entities/Restaurant";

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

const selectCartPriceSql = `
    SELECT 
        SUM(
            CASE WHEN discountPrice IS NULL 
                THEN price * count
                ELSE discountPrice * count
            END
        ) as cart_sum
    FROM Orders
    INNER JOIN OrderProducts ON Orders.id = OrderProducts.order_id
    INNER JOIN Products ON OrderProducts.product_id = Products.id  
    WHERE Orders.date IS NULL
`;

export default class DatabaseApi {
    private static onCartChangeListeners: Array<(cart: Cart) => void> = [];
    private static lastCart?: Cart;

    public static async getLastCart(): Promise<Cart> {
        if (!this.lastCart) {
            return this.getCart();
        }
        return this.lastCart;
    }

    public static addOnCartChangeListener(listener: (cart: Cart) => void) {
        this.onCartChangeListeners.push(listener);
    }

    public static removeOnCartChangeListener(listener: (cart: Cart) => void) {
        const index = this.onCartChangeListeners.indexOf(listener);
        if (index !== undefined) {
            this.onCartChangeListeners.splice(index, 1);
        }
    }

    private static async callOnCartChangeListeners(): Promise<void> {
        return DatabaseApi.getCart().then((cart) => {
            this.onCartChangeListeners.forEach((listener) => {
                listener(cart);
            });
        });
    }

    /**
     * Get array of products
     * @return {Promise<Product[]>} Promise contains array of products
     */
    static getProducts(): Promise<Product[]> {
        const sql = `
            SELECT 
                id as product_id,
                name, price, discountPrice, imageUrl, type, composition, available
            FROM Products
        `;
        return this.executeQuery(sql).then((results) => {
            return this.parseProducts(results);
        });
    }

    /**
     * Get user orders with products
     * @return {Promise<Order>} Promise contains order
     */
    static getOrders(): Promise<Order> {
        const sql = `
            SELECT 
                Orders.id as order_id, 
                date, address, comment,
                Products.id as product_id,
                name, price, discountPrice, imageUrl, type, composition, available
            FROM Orders
            INNER JOIN OrderProducts ON Orders.id = OrderProducts.order_id
            INNER JOIN Products ON OrderProducts.product_id = Products.id  
            WHERE Orders.date IS NOT NULL
        `;

        return this.executeQuery(sql).then((results) => {
            const products = this.parseProducts(results);
            return Order.parseDatabaseResponse(results.rows.raw(), products);
        });
    }

    /**
     * Get restaurants
     * @return {Promise<Restaurant[]>} Promise contains array of restaurant
     */
    static getRestaurants(): Promise<Restaurant[]> {
        const sql = `SELECT * FROM Restaurants`;
        return this.executeQuery(sql).then((results) => {
            return results.rows.raw().map((json) => Restaurant.parseDatabaseJson(json));
        });
    }

    // region Cart

    /**
     * Get cart with all products
     * @return {Promise<Cart>} Promise contains cart
     */
    static getCart(): Promise<Cart> {
        let sql = `
            SELECT 
                Orders.id as cart_id,
                Products.id as product_id,
                name, price, discountPrice, imageUrl, type,
                OrderProducts.count as count
            FROM Orders
            INNER JOIN OrderProducts ON Orders.id = OrderProducts.order_id
            INNER JOIN Products ON OrderProducts.product_id = Products.id  
            WHERE Orders.date IS NULL
        `;

        return this.executeQuery(sql)
            .then((results) => {
                const products = this.parseProducts(results);
                if (products.length) {
                    const cartId = results.rows.raw()[0].cart_id;
                    return new Cart(cartId, products);
                } else {
                    return this.getCartId().then((cartId) => {
                        return new Cart(cartId, []);
                    });
                }
            })
            .then((cart) => {
                this.lastCart = cart;
                return cart;
            });
    }

    /**
     * Add product to cart and return new cart price
     * @param {TKey} productId
     * @param {number} count
     * @return {Promise<number>} Promise contains new cart price
     */
    static addProductToCart(productId: TKey, count?: number): Promise<number> {
        return this.getCartId().then((cartId) => {
            count = count ? count : 1;

            const sql = `INSERT INTO OrderProducts (order_id, product_id, count) VALUES (${cartId}, ${productId}, ${count})`;

            return this.executeQuery(sql)
                .then(() => this.executeQuery(selectCartPriceSql))
                .then((results) => {
                    return this.callOnCartChangeListeners().then(() => {
                        return results.rows.raw()[0]?.cart_sum || 0;
                    });
                });
        });
    }

    /**
     * Add product to cart and return new cart price
     * @param {TKey} productId
     * @param {number} count New count of product
     * @return {Promise<number>} Promise contains new cart price
     */
    static updateProductCount(productId: TKey, count: number): Promise<number> {
        return this.getCartId().then((cartId) => {
            const sql = `UPDATE OrderProducts SET count=${count} WHERE order_id = ${cartId} AND product_id = ${productId}`;
            return this.executeQuery(sql)
                .then(() => this.executeQuery(selectCartPriceSql))
                .then((results) => {
                    return this.callOnCartChangeListeners().then(() => {
                        return results.rows.raw()[0]?.cart_sum || 0;
                    });
                });
        });
    }

    /**
     * Remove product from cart and return new cart price
     * @param {TKey} productId
     * @return {Promise<number>} Promise contains new cart price
     */
    static removeProductFromCart(productId: TKey): Promise<number> {
        return this.getCartId().then((cartId) => {
            const sql = `DELETE FROM OrderProducts WHERE order_id = ${cartId} AND product_id = ${productId}`;
            return this.executeQuery(sql)
                .then(() => this.executeQuery(selectCartPriceSql))
                .then((results) => {
                    return this.callOnCartChangeListeners().then(() => {
                        return results.rows.raw()[0]?.cart_sum || 0;
                    });
                });
        });
    }

    /**
     * Remove all products from cart and return new cart price
     * @remark After clear cart price is 0
     * @return {Promise<number>} Promise contains new cart price.
     */
    static clearCart(): Promise<number> {
        return this.getCartId().then((cartId) => {
            const sql = `DELETE FROM OrderProducts WHERE order_id = ${cartId}`;
            return this.executeQuery(sql).then(() => {
                return this.callOnCartChangeListeners().then(() => {
                    return 0;
                });
            });
        });
    }

    /**
     * Create order from cart and create new cart
     * @return {Promise<TKey>} Promise contains new cart id
     */
    static createOrderFromCart(address: string, comment: string): Promise<TKey> {
        return this.getCartId().then((cartId) => {
            const sql = `
                UPDATE Orders SET 
                    date=datetime('now','localtime'), 
                    address=${address}, 
                    comment=${comment} 
                WHERE id=${cartId};
                INSERT INTO Orders DEFAULT VALUES;
                SELECT max(id) as id FROM Orders WHERE date IS NULL
            `;
            return this.executeQuery(sql).then((results) => {
                return results.rows.raw()[0]?.id;
            });
        });
    }

    // endregion

    // TODO попробовать написать запросы, работающие с корзиной, так, чтобы они сами высчитывали cart id
    //  Благодаря этому будет выполняться всегда один запрос к БД
    private static getCartId(): Promise<number> {
        const sql = `SELECT max(id) as id FROM Orders WHERE date IS NULL`;
        return this.executeQuery(sql).then((results) => {
            return results.rows.raw()[0]?.id;
        });
    }

    private static parseProducts(results: IResults): Product[] {
        const raw = results.rows.raw();
        const products: Product[] = [];
        raw.forEach((json) => {
            if (json.count) {
                for (let i = 0; i < json.count; i++) {
                    products.push(Product.parseDatabaseJson(json));
                }
            } else {
                products.push(Product.parseDatabaseJson(json));
            }
        });
        return products;
    }

    /**
     * Execute sql queries
     *
     * @param sql
     *
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
