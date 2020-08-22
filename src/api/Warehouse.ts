import Product from "../entities/Product";
import {ProductType} from "../entities/ProductType";

/**
 * Api for "Мой Склад"
 * @class WarehouseApi
 */
export default class WarehouseApi {
    /**
     * Load products of one type.
     * @param productType
     */
    static loadProducts(productType: ProductType): Promise<Product[]> {
        return this.getGroupUrl(productType).then((groupUrl: string) => {
            const url =
                "https://online.moysklad.ru/api/remap/1.1/entity/assortment?filter=productFolder=" +
                groupUrl;
            return this.fetchUrl(url, "GET").then((json) => {
                return this.parseProducts(json);
            });
        });
    }

    /**
     * Get url on group by product type.
     * @param productType
     * @private
     */
    private static getGroupUrl(productType: ProductType): Promise<string> {
        const url =
            "https://online.moysklad.ru/api/remap/1.1/entity/productfolder?filter=code=" +
            productType;
        return this.fetchUrl(url, "GET").then((json) => {
            return json.rows[0].meta.href;
        });
    }

    /**
     * Parse products from json response
     * @param json Parsed json from api response
     * @return List of products
     * @private
     */
    private static parseProducts(json: any): Product[] {
        const products: Product[] = [];

        json.rows.forEach((jsonProduct: any) => {
            const product = new Product(jsonProduct);
            products.push(product);
        });

        return products;
    }

    private static fetchUrl(url: string, method: string): Promise<any> {
        return fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Lognex-Pretty-Print-JSON": "true",
                "If-Modified-Since": "00000101000000", // иногда выскакивала ошибка неправильного формата
                Authorization: "Basic YWRtaW5Ac3Rvcm1raXJpbGw5ODo2NjE3OGNmZTZj",
            },
        }).then((response) => response.json());
    }
}
