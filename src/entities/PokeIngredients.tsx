export enum PokeIngredients {
    Base = "base",
    Protein = "protein",
    Filler = "filler",
    Topping = "topping",
    Sauce = "souce",
    Crunch = "crunch",
    None = "",
}

export namespace PokeIngredients {
    export function parse(value: string): PokeIngredients {
        switch (value) {
            case PokeIngredients.Base:
                return PokeIngredients.Base;
            case PokeIngredients.Protein:
                return PokeIngredients.Protein;
            case PokeIngredients.Filler:
                return PokeIngredients.Filler;
            case PokeIngredients.Topping:
                return PokeIngredients.Topping;
            case PokeIngredients.Sauce:
                return PokeIngredients.Sauce;
            case PokeIngredients.Crunch:
                return PokeIngredients.Crunch;
            default:
                return PokeIngredients.None;
        }
    }

    export function translateCategoryName(category: string): string {
        switch (category) {
            case PokeIngredients.Base:
                return "Основа";
            case PokeIngredients.Protein:
                return "Протеин";
            case PokeIngredients.Filler:
                return "Наполнитель";
            case PokeIngredients.Topping:
                return "Топпинг";
            case PokeIngredients.Sauce:
                return "Соус";
            case PokeIngredients.Crunch:
                return "Хруст";
            default:
                return "";
        }
    }
}
