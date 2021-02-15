import "react-native-gesture-handler";
import * as React from "react";
import {Component} from "react";
import SplashScreen from "react-native-splash-screen";
import Navigation from "./screens/navigation/Navigation";
import SQLite from "react-native-sqlite-storage";
import YaMap from "react-native-yamap";
import {LogBox, Platform} from "react-native";
import RNTinkoffAsdk from "react-native-tinkoff-asdk";
import RealtimeDatabaseApi from "./api/firebase/RealtimeDatabaseApi";
import TinkoffCredentials from "./utils/payment/entity/TinkoffCredentials";
import GooglePayCredentials from "./utils/payment/entity/GooglePayCredentials";

YaMap.init("e1e7ca61-b8c3-4b09-a837-bea473d4de8b");
LogBox.ignoreAllLogs(true);

export default class App extends Component<Readonly<any>, Readonly<any>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        Promise.all([
            RealtimeDatabaseApi.getTinkoffPaymentCredentials(),
            RealtimeDatabaseApi.getGooglePaymentCredentials(),
        ])
            .then((creds) => {
                global.tinkoffCredentials = creds.find((el) => el instanceof TinkoffCredentials);
                global.googlePayCredentials = creds.find((el) => el instanceof GooglePayCredentials);
            })
            .then(() => {
                RNTinkoffAsdk.init({
                    terminalKey: global.tinkoffCredentials.terminal,
                    password: global.tinkoffCredentials.password,
                    publicKey: global.tinkoffCredentials.publicKey,
                    testMode: true,
                    debugLog: true,
                });
            })
            .then(() => SplashScreen.hide());
    }

    render() {
        return <Navigation />;
    }
}

// if (Platform.OS === "android") {
//     global.googlePayService = new GooglePayService(
//         {
//             tokenizationSpecification: {
//                 type: "PAYMENT_GATEWAY",
//                 // other:
//                 gateway: "tinkoff",
//                 gatewayMerchantId: "BCR2DN6TWP34ZTAG",
//                },
//             allowedCardNetworks: ["VISA", "MASTERCARD"],
//             allowedCardAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
//         },
//         "Example Merchant",
//         "ENVIRONMENT_PRODUCTION",
//     );
// }
//
// if (Platform.OS === "ios") {
//     global.applePayService = new ApplePayService({
//         merchantIdentifier: "exampleGatewayMerchantId",
//         supportedNetworks: ["visa", "mastercard", "amex"],
//         countryCode: "RU",
//         currencyCode: Currency.RUB,
//     });
// }

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
