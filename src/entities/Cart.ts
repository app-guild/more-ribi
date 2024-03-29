import Product from "./Product";
import {TKey} from "../utils/database/DatabaseApi";
import {ProductType} from "./ProductType";

export default class Cart {
    constructor(protected _id: TKey, protected _products: Map<Product, number>) {}

    get products(): Product[] {
        return Array.from(this._products.keys());
    }

    setProducts(value: Map<Product, number>) {
        this._products = value;
    }

    get totalPrice() {
        return this.countTotalPrice(this._products);
    }

    get id(): TKey {
        return this._id;
    }

    popUnavailableProducts(): Product[] {
        const unavailableProducts = Array.from(this._products.entries()).filter((prod) => !prod[0].available);
        unavailableProducts.forEach((prod) => this._products.delete(prod[0]));
        return unavailableProducts.map((pair) => pair[0]);
    }

    updateProductsInfo(newProducts: Product[]) {
        Array.from(this._products.keys()).forEach((prod) => {
            const newProd = newProducts.find((it: Product) => {
                return it.type + it.name === prod.type + prod.name;
            });
            if (newProd) {
                Object.assign(prod, {
                    _price: newProd.price,
                    _discountPrice: newProd.discountPrice,
                    _available: newProd.available,
                    _image: newProd.image,
                    _composition: newProd.composition,
                });
            }
        });
    }

    addProduct(product: Product, count?: number): void {
        if (this.getProductById(product.id)) {
            return;
        }
        if (count) {
            this._products.set(product, count);
        } else {
            this._products.set(product, 1);
        }
    }

    removeProduct(product: Product): void {
        const originalProduct = this.getProductById(product.id);
        this._products.delete(originalProduct);
    }

    replaceProduct(oldProduct: Product, newProduct: Product): void {
        const count = this._products.get(oldProduct) || 0;
        if (count) {
            this._products.delete(oldProduct);
            this._products.set(newProduct, count);
        }
    }

    updateCount(product: Product, count: number): void {
        if (!count) {
            this.removeProduct(product);
            return;
        }

        const originalProduct = this.getProductById(product.id);
        if (originalProduct) {
            this._products.set(originalProduct, count);
        } else {
            this.addProduct(product, count);
        }
    }

    clear() {
        this._products.clear();
    }

    getWokCount(product: Product): number {
        if (product.type === ProductType.Wok) {
            const woks = this.getProductsByTypeAndName(product.type, product.name);
            if (woks.length === 0) {
                return 0;
            } else {
                let count = 0;
                woks.forEach((it) => {
                    count += this._products.get(it) || 0;
                });
                return count;
            }
        } else {
            return this.getProductCount(product);
        }
    }

    getProductCount(product: Product): number {
        const originalProduct = this.getProductById(product.id);
        if (originalProduct) {
            return this._products.get(originalProduct) || 0;
        }
        return 0;
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

    private countTotalPrice(products: Map<Product, number>): number {
        let totalPrice = 0;
        products.forEach((count, product) => {
            const discountPrice = product.discountPrice;
            totalPrice += discountPrice !== undefined ? discountPrice * count : product.price * count;
        });
        return totalPrice;
    }

    private getProductById(productId: TKey): Product | undefined {
        return Array.from(this._products.keys()).find((it) => it.id === productId);
    }

    private getProductsByTypeAndName(productType: ProductType, productName: string): Product[] {
        return Array.from(this._products.keys()).filter((it) => it.type === productType && it.name === productName);
    }
}
