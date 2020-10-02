import database from "@react-native-firebase/database";
import {ProductType} from "../../entities/ProductType";
import Product from "../../entities/Product";
import Restaurant from "../../entities/Restaurant";
import Ingredient from "../../entities/Ingredient";
import InstagramPost from "../../entities/InstagramPost";

interface ProductJson {
    name: string;
    price: number;
    image: string;
    composition: string;
    available?: boolean;
    discountPrice?: number;
}

type ProductsJson = Map<string, ProductJson[]>;

export default class RealtimeDatabaseApi {
    /**
     * Return promise with map when for each product type contains list of products
     * @return {Promise<Map<ProductType, Product[]>>}
     */
    static async getProducts(): Promise<Map<ProductType, Product[]>> {
        return database()
            .ref("/products")
            .once("value")
            .then((snapshot) => this.parseProducts(snapshot.val()));
    }

    /**
     * Return promise with array of restaurants
     * @return {Promise<Restaurant[]>}
     */
    static async getRestaurants(): Promise<Restaurant[]> {
        return database()
            .ref("/restaurants")
            .once("value")
            .then((snapshot) => this.parseRestaurants(snapshot.val()));
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
            .then((snapshot) => this.parseConstructorIngredients(snapshot.val()));
    }

    static async getWokConstructorIngredients(): Promise<Map<string, Ingredient[]>> {
        return database()
            .ref("/constructor/wok")
            .once("value")
            .then((snapshot) => this.parseConstructorIngredients(snapshot.val()));
    }

    private static parseProducts(productsJson: ProductsJson): Map<ProductType, Product[]> {
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

    private static parseInstagramPosts(json: any): InstagramPost[] {
        return Object.values(json).map((it) => InstagramPost.parseRealtimeDatabaseJson(it));
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
