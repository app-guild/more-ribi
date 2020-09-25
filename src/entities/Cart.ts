import Product from "./Product";
import {TKey} from "../utils/database/DatabaseApi";

export default class Cart {
    private _totalPrice: number = 0;

    constructor(protected _id: TKey, protected _products: Map<Product, number>) {
        this._totalPrice = this.countTotalPrice(this._products);
    }

    private countTotalPrice(products: Map<Product, number>): number {
        let totalPrice = 0;
        products.forEach((count, product) => {
            const discountPrice = product.discountPrice;
            totalPrice += discountPrice !== undefined ? discountPrice * count : product.price * count;
        });
        return totalPrice;
    }

    get products(): Product[] {
        return Array.from(this._products.keys());
    }

    get totalPrice() {
        return this._totalPrice;
    }

    get id(): TKey {
        return this._id;
    }

    addProduct(product: Product): void {
        if (this.getProductById(product.id)) {
            return;
        }
        this._products.set(product, 1);
    }

    removeProduct(product: Product): void {
        const originalProduct = this.getProductById(product.id);
        this._products.delete(originalProduct);
    }

    updateCount(product: Product, count: number): void {
        if (!count) {
            this.removeProduct(product);
            return;
        }

        const originalProduct = this.getProductById(product.id);
        if (originalProduct) {
            this._products.set(originalProduct, count);
        }
    }

    clear() {
        this._products.clear();
    }

    getProductCount(product: Product): number {
        const originalProduct = this.getProductById(product.id);
        return this._products.get(originalProduct) || 0;
    }

    getJsonProducts(): string {
        const objects = Array.from(this._products.keys()).map((product) => {
            const count = this._products.get(product);
            return {
                ...product.toObject(),
                count,
            };
        });
        return JSON.stringify(objects);
    }

    private getProductById(productId: TKey): Product | undefined {
        return Array.from(this._products.keys()).find((it) => it.id === productId);
    }
}
