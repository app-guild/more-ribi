import database from "@react-native-firebase/database";
import {ProductType} from "../../entities/ProductType";
import Product from "../../entities/Product";

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
    static async getProducts(): Promise<Map<ProductType, Product[]>> {
        return database()
            .ref("/products")
            .once("value")
            .then((snapshot) => this.parseDatabaseProducts(snapshot.val()));
    }

    private static parseDatabaseProducts(productsJson: ProductsJson): Map<ProductType, Product[]> {
        const map = ProductType.map();
        for (const [type, products] of Object.entries(productsJson)) {
            const parsedProducts = products.map((productJson: ProductJson) =>
                Product.parseRealtimeDatabaseJson(productJson),
            );
            const parsedType = ProductType.parse(type);
            map.set(parsedType, parsedProducts);
        }
        return map;
    }
}
