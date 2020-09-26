export default class Ingredient {
    constructor(
        private _name: string,
        private _mainPrice: number | undefined,
        private _additionalPrice: number | undefined,
    ) {}

    get name(): string {
        return this._name;
    }

    get mainPrice(): number | undefined {
        return this._mainPrice;
    }

    get additionalPrice(): number | undefined {
        return this._additionalPrice;
    }

    static parseRealtimeDatabaseJson(it: any): Ingredient {
        return new Ingredient(it.name, it.mainPrice, it.additionalPrice);
    }
}
