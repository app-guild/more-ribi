export enum PaymentsMethods {
    InternetAcquiring = "Картой онлайн",
    ApplePay = "Apple Pay",
    CardToCourier = "Картой курьеру",
    CashToCourier = "Наличными курьеру",
}

export namespace PaymentsMethods {
    export function parse(value: string): PaymentsMethods | null {
        switch (value) {
            case PaymentsMethods.InternetAcquiring:
                return PaymentsMethods.InternetAcquiring;
            case PaymentsMethods.ApplePay:
                return PaymentsMethods.ApplePay;
            case PaymentsMethods.CardToCourier:
                return PaymentsMethods.CardToCourier;
            case PaymentsMethods.CashToCourier:
                return PaymentsMethods.CashToCourier;
            default:
                return null;
        }
    }
}
