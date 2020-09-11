export enum ProductType {
    Wok = "wok",
    Deserts = "deserts",
    Beverages = "beverages",
    Poke = "poke",
    Rolls = "rolls",
    Soups = "soups",
    Empty = "",
}

export function translateCategoryName(category: string) {
    switch (category) {
        case ProductType.Wok:
            return "Вок";
        case ProductType.Deserts:
            return "Десерты";
        case ProductType.Beverages:
            return "Напитки";
        case ProductType.Poke:
            return "Поке";
        case ProductType.Rolls:
            return "Роллы";
        case ProductType.Soups:
            return "Супы";
        case ProductType.Empty:
            return "";
        default:
            return "";
    }
}
