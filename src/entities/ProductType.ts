export enum ProductType {
    Wok = "wok",
    Deserts = "deserts",
    Beverages = "beverages",
    Poke = "poke",
    Rolls = "rolls",
    Soups = "soups",
}

export function translateCategoryName(category: any){
    switch (category) {
        case ProductType.Wok:
            return "Вок"
        case ProductType.Deserts:
            return "Десерты"
        case ProductType.Beverages:
            return "Напитки"
        case ProductType.Poke:
            return "Поке"
        case ProductType.Rolls:
            return "Роллы"
        case ProductType.Soups:
            return "Супы"
        default:
            return "Поке"
    }
}
