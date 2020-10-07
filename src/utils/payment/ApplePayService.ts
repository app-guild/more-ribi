import {PaymentRequest} from "react-native-payments";
import {Currency} from "./Currency";

type Network = "amex" | "discover" | "jcb" | "mastercard" | "visa";

interface IMethodData {
    merchantIdentifier: string;
    supportedNetworks: Network[];
    countryCode: string; // US | RU
    currencyCode: Currency;
}

interface IPaymentMethodData {
    supportedMethods: string[];
    data: IMethodData;
}

export interface IPaymentDetails {
    displayItems?: {label: string, amount: {currency: Currency, value: string}}[];
    total: {
        label: string;
        amount: {currency: Currency, value: string},
    };
}

export default class ApplePayService {
    private defaultId = "more-ribi-apple-pay";
    private readonly supportedMethods = ["apple-pay"];
    public methodData: IPaymentMethodData[];

    constructor(methodData: IMethodData) {
        this.methodData = [
            {
                supportedMethods: this.supportedMethods,
                data: methodData,
            },
        ];
    }

    public getPaymentRequest(details: IPaymentDetails): any {
        const paymentDetails = Object.assign({id: this.defaultId}, details);
        return new PaymentRequest(this.methodData, paymentDetails);
    }

    public static processPayment(paymentRequest: any, callback?: (paymentDetails: any) => void) {
        return paymentRequest.show().then((paymentResponse: any) => {
            if (callback) {
                callback(paymentResponse);
            }
        });
    }
}
