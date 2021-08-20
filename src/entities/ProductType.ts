import Product from "./Product";

export enum ProductType {
    Wok = "wok",
    Deserts = "deserts",
    Beverages = "beverages",
    Poke = "poke",
    CustomPoke = "customPoke",
    Rolls = "rolls",
    Soups = "soups",
    None = "",
}

export namespace ProductType {
    export function parse(value: string): ProductType {
        switch (value) {
            case ProductType.Wok:
                return ProductType.Wok;
            case ProductType.Deserts:
                return ProductType.Deserts;
            case ProductType.Beverages:
                return ProductType.Beverages;
            case ProductType.Poke:
                return ProductType.Poke;
            case ProductType.Rolls:
                return ProductType.Rolls;
            case ProductType.Soups:
                return ProductType.Soups;
            case ProductType.CustomPoke:
                return ProductType.CustomPoke;
            default:
                return ProductType.None;
        }
    }

    export function translateCategoryName(category: string): string {
        switch (category) {
            case ProductType.Wok:
                return "Вок";
            case ProductType.Deserts:
                return "Десерты";
            case ProductType.Beverages:
                return "Напитки";
            case ProductType.Poke:
                return "Поке";
            case ProductType.CustomPoke:
                return "Конструктор поке";
            case ProductType.Rolls:
                return "Роллы";
            case ProductType.Soups:
                return "Супы";
            default:
                return "";
        }
    }

    export function map(): Map<ProductType, Product[]> {
        return new Map([
            [ProductType.Wok, []],
            [ProductType.Rolls, []],
            [ProductType.Soups, []],
            [ProductType.Beverages, []],
            [ProductType.Poke, []],
            [ProductType.Deserts, []],
            [ProductType.None, []],
        ]);
    }
}
