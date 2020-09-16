import {Currency} from "./Currency";

export interface IPaymentTransaction {
    totalPrice: string;
    totalPriceStatus: "FINAL" | "NOT_CURRENTLY_KNOWN";
    currencyCode: Currency;
}
