export enum PaymentsMethods {
    InternetAcquiring = "Картой онлайн",
    CardToCourier = "Картой курьеру",
    CashToCourier = "Наличными курьеру",
}

export namespace PaymentsMethods {
    export function parse(value: string): PaymentsMethods | null {
        switch (value) {
            case PaymentsMethods.InternetAcquiring:
                return PaymentsMethods.InternetAcquiring;
            case PaymentsMethods.CardToCourier:
                return PaymentsMethods.CardToCourier;
            case PaymentsMethods.CashToCourier:
                return PaymentsMethods.CashToCourier;
            default:
                return null;
        }
    }
}
