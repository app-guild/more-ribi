import {CardNetworks} from "./CardNetworks";
import {IPaymentTransaction} from "./PaymentTransaction";
import GPay from "react-native-gpay";

export interface IGateway {
    name: string; // Identify your gateway and your app's gateway merchant identifier     https://developers.google.com/pay/api/android/reference/object#PaymentMethodTokenizationSpecification
    merchantId: string;
    clientKey?: string; // OPTIONAL YOUR_TOKENIZATION_KEY. Need for BRAINTREE & STRIPE GATEWAY.
    sdkVersion?: string; // OPTIONAL YOUR Client.VERSION. Need for BRAINTREE & STRIPE GATEWAY.
}

export interface IPaymentMethod {
    gateway: IGateway;
    cardNetworks: CardNetworks[];
}

export interface IPaymentRequest {
    cardPaymentMethodMap: IPaymentMethod;
    transaction: IPaymentTransaction;
    merchantName?: string;
}

export class GooglePayService {
    public static cardPaymentMethodMap: IPaymentMethod;
    public static merchantName?: string;
    public static environment: "ENVIRONMENT_TEST" | "ENVIRONMENT_PRODUCTION";

    public static getRequest(transaction: IPaymentTransaction): any {
        const paymentRequest: IPaymentRequest = {
            cardPaymentMethodMap: this.cardPaymentMethodMap,
            merchantName: this.merchantName,
            transaction: transaction,
        };
        return new GPay(this.environment, paymentRequest);
    }

    public static async isEnvironmentAvailable() {
        return await GPay.checkGPayIsEnable(this.environment).catch((error: any) => {
            return false;
        });
    }
}
