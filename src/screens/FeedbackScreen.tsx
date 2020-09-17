import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";
import {Currency} from "../utils/payment/Currency";

export interface IFeedbackScreenState {}

class FeedbackScreen extends Component<Readonly<any>, Readonly<IFeedbackScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    payWithGooglePay(): void {
        global.googlePayService
            .doPaymentRequest(
                {
                    totalPrice: "10",
                    totalPriceStatus: "FINAL",
                    currencyCode: Currency.USD,
                },
                (token: string) => console.log(token),
            )
            .then(() => {
                return;
            });
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Feedback Screen</Text>

                <Text>Welcome to react-native-google-pay!</Text>
                <TouchableOpacity onPress={() => this.payWithGooglePay()}>
                    <Text>PAYMENT_GATEWAY</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default FeedbackScreen;
