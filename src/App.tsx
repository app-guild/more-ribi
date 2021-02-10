import "react-native-gesture-handler";
import * as React from "react";
import {Component} from "react";
import SplashScreen from "react-native-splash-screen";
import Navigation from "./screens/navigation/Navigation";
import SQLite from "react-native-sqlite-storage";
import YaMap from "react-native-yamap";
import {LogBox, Platform} from "react-native";
import RNTinkoffAsdk from "react-native-tinkoff-asdk";
import Config from "react-native-config";

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

RNTinkoffAsdk.init({
    terminalKey: Config.terminalKey, //"1611689121147DEMO",
    password: Config.terminalPassword, //"jhlldfhr107f2155s",
    publicKey: Config.publicKey,
    testMode: false,
    debugLog: true,
});

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
