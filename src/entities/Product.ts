import {TKey} from "../database/DatabaseApi";
import {ProductType} from "./ProductType";

export default class Product {
    constructor(
        private _id: TKey,
        private _name: string,
        private _type: ProductType,
        private _price: number,
        private _discountPrice: number | null,
        private _available: boolean,
        private _imageUrl: string,
        private _composition: string,
    ) {}

    get id(): TKey {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get type(): ProductType {
        return this._type;
    }

    get isAvailable(): boolean {
        return this._available;
    }

    get imageUrl(): string {
        return this._imageUrl;
    }

    get price(): number {
        return this._price;
    }

    get discountPrice(): number | null {
        return this._discountPrice;
    }

    get composition(): string {
        return this._composition;
    }

    static parseDatabaseJson(json: any): Product {
        return new Product(
            json.id,
            json.name,
            ProductType.parse(json.type),
            json.price,
            json.discountPrice,
            json.available,
            json.imageUrl,
            json.composition,
        );
    }

    static parseMoySkladJson(json: any): Product {
        return new Product(
            json.id,
            json.name,
            ProductType.parse(json.type), // TODO уточнить какое поле нужно брать
            json?.salePrices[0]?.value,
            null, // TODO уточнить чему равно
            !!json.quantity,
            json?.image?.meta?.href,
            json.composition, // TODO уточнить чему равно
        );
    }
}
