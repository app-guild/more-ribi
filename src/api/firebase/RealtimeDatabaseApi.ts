import database from "@react-native-firebase/database";
import {ProductType} from "../../entities/ProductType";
import Product from "../../entities/Product";
import Restaurant from "../../entities/Restaurant";
import Ingredient from "../../entities/Ingredient";
import InstagramPost from "../../entities/InstagramPost";
import DatabaseApi from "../../utils/database/DatabaseApi";
import GooglePayCredentials from "../../utils/payment/entity/GooglePayCredentials";
import TinkoffCredentials from "../../utils/payment/entity/TinkoffCredentials";

interface ProductJson {
    name: string;
    price: number;
    image: string;
    composition: string;
    available?: boolean;
    discountPrice?: number;
}

type ProductsJson = Map<string, ProductJson[]>;

database().setPersistenceEnabled(true);

// Нужно подписываться на каждый тип продуктов.
// Если подписаться на products, то при изменении одного продукта firebase посчитает,
// что изменилась группа и вернет все ее продукты
for (let productType in ProductType) {
    productType = productType.toLowerCase();
    database()
        .ref("/products/" + productType)
        .on("child_changed", (snapshot: any) => {
            let response = snapshot.val();
            // Если изменился один элемент, то вернется объект измененного элемента,
            // а если изменилось несколько элементво, то будет массив. Работаем всегда с массивом
            if (!(response instanceof Array)) {
                response = [response];
            }

            const changedProducts = response.map((productJson: ProductJson) =>
                Product.parseRealtimeDatabaseJson(productJson, ProductType.parse(productType)),
            );

            // обновляем продукты в корзине
            DatabaseApi.getCart().then((cart) => {
                cart.updateProductsInfo(changedProducts);
                RealtimeDatabaseApi.callProductsChangedListeners(changedProducts);
                return DatabaseApi.updateProductsInCart(cart);
            });
        });
}

export default class RealtimeDatabaseApi {
    private static _onProductsChangedListeners: Function[] = [];

    static addProductsChangedListener(listener: (newProducts: Product[]) => void) {
        this._onProductsChangedListeners.push(listener);
    }

    static removeProductsChangedListener(listener: (newProducts: Product[]) => void) {
        const index = this._onProductsChangedListeners.indexOf(listener);
        if (index !== undefined) {
            this._onProductsChangedListeners.splice(index, 1);
        }
    }

    static callProductsChangedListeners(newProducts: Product[]): void {
        this._onProductsChangedListeners.forEach((listener) => {
            listener(newProducts);
        });
    }

    /**
     * Return promise with map when for each product type contains list of products
     * @return {Promise<Map<ProductType, Product[]>>}
     */
    static async getProducts(): Promise<Map<ProductType, Product[]>> {
        return database()
            .ref("/products")
            .once("value")
            .then((snapshot) => {
                return this.parseProducts(snapshot.val());
            });
    }

    /**
     * Return promise with array of restaurants
     * @return {Promise<Restaurant[]>}
     */
    static async getTinkoffPaymentCredentials(): Promise<TinkoffCredentials> {
        return database()
            .ref("/delivery/payments/tinkoff")
            .once("value")
            .then((snapshot) => this.parseTinkoffCredentials(snapshot.val()));
    }

    static async getGooglePaymentCredentials(): Promise<GooglePayCredentials> {
        return database()
            .ref("/delivery/payments/googlePay")
            .once("value")
            .then((snapshot) => this.parseGooglePayCredentials(snapshot.val()));
    }

    static async getRestaurants(): Promise<Restaurant[]> {
        return database()
            .ref("/restaurants")
            .once("value")
            .then((snapshot) => this.parseRestaurants(snapshot.val()));
    }

    static async getDestinationEmail(): Promise<string> {
        return database()
            .ref("/delivery/destination_email")
            .once("value")
            .then((snapshot) => snapshot.val());
    }

    static async getMinimumOrderPrice(): Promise<number> {
        return database()
            .ref("/delivery/minimum_order_price")
            .once("value")
            .then((snapshot) => snapshot.val());
    }
    static async getDeliveryPrice(): Promise<number> {
        return database()
            .ref("/delivery/delivery_price")
            .once("value")
            .then((snapshot) => snapshot.val());
    }

    static async getInstagramPosts(): Promise<InstagramPost[]> {
        return database()
            .ref("/instagram")
            .once("value")
            .then((snapshot) => this.parseInstagramPosts(snapshot.val()));
    }

    static async getPokeConstructorIngredients(): Promise<Map<string, Ingredient[]>> {
        return database()
            .ref("/constructor/poke")
            .once("value")
            .then((snapshot) => {
                return this.parseConstructorIngredients(snapshot.val());
            });
    }

    static async getWokConstructorIngredients(): Promise<Map<string, Ingredient[]>> {
        return database()
            .ref("/constructor/wok")
            .once("value")
            .then((snapshot) => this.parseConstructorIngredients(snapshot.val()));
    }

    static parseProducts(productsJson: ProductsJson): Map<ProductType, Product[]> {
        const map = ProductType.map();
        for (const [type, products] of Object.entries(productsJson)) {
            const parsedType = ProductType.parse(type);
            const parsedProducts = products.map((productJson: ProductJson) =>
                Product.parseRealtimeDatabaseJson(productJson, parsedType),
            );
            map.set(parsedType, parsedProducts);
        }
        return map;
    }

    private static parseRestaurants(response: any[]): Restaurant[] {
        return response.filter((it) => !!it).map((it) => Restaurant.parseRealtimeDatabaseJson(it));
    }

    private static parseGooglePayCredentials(response: any): GooglePayCredentials {
        return new GooglePayCredentials(response.merchantId);
    }

    private static parseTinkoffCredentials(response: any): TinkoffCredentials {
        return new TinkoffCredentials(response.terminal, response.password, response.publicKey);
    }

    static parseInstagramPosts(json: any): InstagramPost[] {
        return Object.entries(json).map((it) => InstagramPost.parseRealtimeDatabaseJson(it[1], it[0]));
    }

    private static parseConstructorIngredients(json: any): Map<string, Ingredient[]> {
        const map = new Map();
        for (const [type, ingredients] of Object.entries(json)) {
            const parsedIngredients = (ingredients as any[]).map((it) => Ingredient.parseRealtimeDatabaseJson(it));
            map.set(type, parsedIngredients);
        }
        return map;
    }
}
