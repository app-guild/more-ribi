export enum PaymentsMethods {
    GooglePay = "GooglePay",
    ApplePay = "ApplePay",
    CardToCourier = "Картой курьеру",
    CashToCourier = "Наличными курьеру",
}

export function parsePaymentsMethods(value: string): PaymentsMethods | null {
    switch (value) {
        case PaymentsMethods.ApplePay:
            return PaymentsMethods.ApplePay;
        case PaymentsMethods.GooglePay:
            return PaymentsMethods.GooglePay;
        case PaymentsMethods.CardToCourier:
            return PaymentsMethods.CardToCourier;
        case PaymentsMethods.CashToCourier:
            return PaymentsMethods.CashToCourier;
        default:
            return null;
    }
}