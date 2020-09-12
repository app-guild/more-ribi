import SQLite from "react-native-sqlite-storage";
import Product from "../entities/Product";
import Cart from "../entities/Cart";

SQLite.DEBUG = true;

export type TKey = string | number;

type Json = any;

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
                THEN price 
                ELSE discountPrice 
            END
        ) as cart_sum
    FROM Orders
    INNER JOIN OrderProducts ON Orders.id = OrderProducts.order_id
    INNER JOIN Products ON OrderProducts.product_id = Products.id  
    WHERE Orders.date IS NULL
`;

export default class DatabaseApi {
    /**
     * Get cart with all products
     */
    static getCart(): Promise<Cart> {
        const sql = `
            SELECT 
                Orders.id as cart_id,
                Products.id as product_id,
                name, price, imageUrl, type
            FROM Orders
            INNER JOIN OrderProducts ON Orders.id = OrderProducts.order_id
            INNER JOIN Products ON OrderProducts.product_id = Products.id  
            WHERE Orders.date IS NULL
        `;

        return this.executeQuery(sql).then((results) => {
            const products = this.parseProducts(results);
            if (products.length) {
                const cartId = results.rows.raw()[0].cart_id;
                return new Cart(cartId, products);
            } else {
                return this.getCartId().then((cartId) => {
                    return new Cart(cartId, []);
                });
            }
        });
    }

    /**
     * Add product to cart and return new cart price
     * @param productId
     */
    static addProductToCart(productId: TKey): Promise<number> {
        // TODO попробовать написать запрос, который сам посчитает cartId без доп запроса
        return this.getCartId().then((cartId) => {
            const sql = `
                INSERT INTO OrderProducts (order_id, product_id) VALUES (${cartId}, ${productId})
                ${selectCartPriceSql}
            `;
            return this.executeQuery(sql).then((results) => {
                return results.rows.raw()[0]?.cart_sum;
            });
        });
    }

    /**
     * Get array of products
     */
    static getProducts(): Promise<Product[]> {
        const sql = `
            SELECT * FROM Products
        `;
        return this.executeQuery(sql).then((results) => {
            return this.parseProducts(results);
        });
    }

    // TODO for test, need remove
    static addProduct(): void {
        const sql = `
            INSERT INTO Products
                (name, price, type, discountPrice) 
            VALUES
                ('poke1', 100, 'poke', NULL)
        `;
        this.executeQuery(sql).then((results) => {
            console.log(results);
        });
    }

    private static getCartId(): Promise<number> {
        const sql = `SELECT max(id) as id FROM Orders WHERE date IS NULL`;
        return this.executeQuery(sql).then((results) => {
            return results.rows.raw()[0]?.id;
        });
    }

    private static parseProducts(results: IResults): Product[] {
        const raw = results.rows.raw();
        return raw.map((json) => Product.parseDatabaseJson(json));
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
