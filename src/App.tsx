import "react-native-gesture-handler";
import * as React from "react";
import {Component} from "react";
import SplashScreen from "react-native-splash-screen";
import Navigation from "./screens/navigation/Navigation";
import SQLite from "react-native-sqlite-storage";
import {GooglePayService} from "./utils/payment/GooglePayService";
import YaMap from "react-native-yamap";
import ApplePayService from "./utils/payment/ApplePayService";
import {Currency} from "./utils/payment/Currency";
import {LogBox, Platform} from "react-native";

YaMap.init("e1e7ca61-b8c3-4b09-a837-bea473d4de8b");
LogBox.ignoreAllLogs(true);

export default class App extends Component<Readonly<any>, Readonly<any>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        return <Navigation />;
    }
}

if (Platform.OS === "android") {
    global.googlePayService = new GooglePayService(
        {
            tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                // other:
                gateway: "tinkoff",
                gatewayMerchantId: "BCR2DN6TWP34ZTAG",
                terminalKey: "1605803895876DEMO",
                password: "m9b1fl8n5ujvrj3a",
                publicKey:
                    "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv5yse9ka3ZQE0feuGtemYv3IqOlLck8zHUM7lTr0za6lXTszRSXfUO7jMb+L5C7e2QNFs+7sIX2OQJ6a+HG8kr+jwJ4tS3cVsWtd9NXpsU40PE4MeNr5RqiNXjcDxA+L4OsEm/BlyFOEOh2epGyYUd5/iO3OiQFRNicomT2saQYAeqIwuELPs1XpLk9HLx5qPbm8fRrQhjeUD5TLO8b+4yCnObe8vy/BMUwBfq+ieWADIjwWCMp2KTpMGLz48qnaD9kdrYJ0iyHqzb2mkDhdIzkim24A3lWoYitJCBrrB2xM05sm9+OdCI1f7nPNJbl5URHobSwR94IRGT7CJcUjvwIDAQAB",
            },
            allowedCardNetworks: ["VISA", "MASTERCARD"],
            allowedCardAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
        },
        "Example Merchant",
        "ENVIRONMENT_PRODUCTION",
    );
}

if (Platform.OS === "ios") {
    global.applePayService = new ApplePayService({
        merchantIdentifier: "exampleGatewayMerchantId",
        supportedNetworks: ["visa", "mastercard", "amex"],
        countryCode: "RU",
        currencyCode: Currency.RUB,
    });
}

global.db = SQLite.openDatabase(
    Platform.OS === "ios"
        ? {
              name: "SQLite.db",
              createFromLocation: 1,
          }
        : {
              name: "SQLite",
              location: "default",
              createFromLocation: "~SQLite.db",
          },
    () => console.log("SUCCESS OPEN DB"),
    (error: any) => console.error("ERROR: " + error),
);
