import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";
import {GooglePayService} from "../utils/payment/GooglePayService";
import {CardNetworks} from "../utils/payment/CardNetworks";
import {Currency} from "../utils/payment/Currency";

GooglePayService.cardPaymentMethodMap = {
    gateway: {
        name: "GATEWAY_NAME", // Identify your gateway and your app's gateway merchant identifier     https://developers.google.com/pay/api/android/reference/object#PaymentMethodTokenizationSpecification
        merchantId: "055XXXXXXXXXXXXX336", // YOUR_GATEWAY_MERCHANT_ID
        clientKey: "sandbox_XXXXXXXXXXXXndxm44jw", // OPTIONAL YOUR_TOKENIZATION_KEY. Need for BRAINTREE & STRIPE GATEWAY.
        sdkVersion: "client.VERSION", // OPTIONAL YOUR Client.VERSION. Need for BRAINTREE & STRIPE GATEWAY.
    },
    cardNetworks: [CardNetworks.VISA, CardNetworks.MASTERCARD],
};

GooglePayService.environment = "ENVIRONMENT_TEST";

export interface IFeedbackScreenState {}

class FeedbackScreen extends Component<Readonly<any>, Readonly<IFeedbackScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount(): void {
        GooglePayService.isEnvironmentAvailable().then((isAvailable: boolean) => {
            console.log(`isAvailable: ${isAvailable}`);
            GooglePayService.getRequest({
                totalPrice: "11",
                totalPriceStatus: "FINAL",
                currencyCode: Currency.USD,
            }).show();
        });
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Feedback Screen</Text>
            </View>
        );
    }
}

export default FeedbackScreen;
