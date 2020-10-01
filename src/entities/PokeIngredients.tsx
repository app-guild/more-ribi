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

    export function sort(a: PokeIngredients, b: PokeIngredients): number {
        return getSortAmount(a) - getSortAmount(b);
    }
    export function getSortAmount(a: PokeIngredients): number {
        switch (a) {
            case PokeIngredients.Base:
                return 0;
            case PokeIngredients.Protein:
                return 1;
            case PokeIngredients.Filler:
                return 2;
            case PokeIngredients.Topping:
                return 3;
            case PokeIngredients.Sauce:
                return 4;
            case PokeIngredients.Crunch:
                return 5;
            default:
                return -1;
        }
    }
}
