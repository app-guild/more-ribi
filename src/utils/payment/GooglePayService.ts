import {AllowedCardAuthMethodsType, AllowedCardNetworkType, GooglePay} from "react-native-google-pay";
import {Currency} from "./Currency";

export interface IPaymentTransaction {
    totalPrice: string;
    totalPriceStatus: "FINAL" | "NOT_CURRENTLY_KNOWN";
    currencyCode: Currency;
}

export interface IGateway {
    type: "PAYMENT_GATEWAY";

    gateway: string;
    gatewayMerchantId?: string;

    terminalKey?: string;
    password?: string;
    publicKey?: string;
}

export interface IDirect {
    type: "DIRECT";
    publicKey: string;
}

export interface IPaymentMethod {
    tokenizationSpecification: IGateway | IDirect;
    allowedCardNetworks: AllowedCardNetworkType[];
    allowedCardAuthMethods: AllowedCardAuthMethodsType[];
}

export interface ICardPaymentRequest {
    cardPaymentMethod: IPaymentMethod;
    transaction: IPaymentTransaction;
    merchantName: string;
}

export class GooglePayService {
    public cardPaymentMethodMap: IPaymentMethod;
    public merchantName: string;

    constructor(
        cardPaymentMethodMap: IPaymentMethod,
        merchantName: string,
        environment?: "ENVIRONMENT_TEST" | "ENVIRONMENT_PRODUCTION",
    ) {
        this.cardPaymentMethodMap = cardPaymentMethodMap;
        this.merchantName = merchantName;
        switch (environment) {
            case "ENVIRONMENT_PRODUCTION":
                GooglePay.setEnvironment(GooglePay.ENVIRONMENT_PRODUCTION);
                break;
            case "ENVIRONMENT_TEST":
            default:
                GooglePay.setEnvironment(GooglePay.ENVIRONMENT_TEST);
        }
    }

    public async isReadyToPay(): Promise<boolean> {
        return GooglePay.isReadyToPay(
            this.cardPaymentMethodMap.allowedCardNetworks,
            this.cardPaymentMethodMap.allowedCardAuthMethods,
        );
    }

    public async doPaymentRequest(
        transaction: IPaymentTransaction,
        tokenCallback?: (token: string) => void,
    ): Promise<boolean> {
        const paymentRequest: ICardPaymentRequest = {
            cardPaymentMethod: this.cardPaymentMethodMap,
            merchantName: this.merchantName,
            transaction: transaction,
        };
        return this.isReadyToPay().then((isReady) => {
            if (isReady) {
                return GooglePay.requestPayment(paymentRequest)
                    .then((token: string) => {
                        // Send a token to your payment gateway
                        if (tokenCallback) {
                            tokenCallback(token);
                        }

                        return true;
                    })
                    .catch((error) => {
                        console.log(error.code, error.message);
                        return false;
                    });
            } else {
                return false;
            }
        });
    }
}
