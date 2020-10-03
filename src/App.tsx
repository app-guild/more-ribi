import "react-native-gesture-handler";
import * as React from "react";
import {Component} from "react";
import SplashScreen from "react-native-splash-screen";
import Navigation from "./screens/navigation/Navigation";
import SQLite from "react-native-sqlite-storage";
import {GooglePayService} from "./utils/payment/GooglePayService";
import YaMap from "react-native-yamap";

YaMap.init("e1e7ca61-b8c3-4b09-a837-bea473d4de8b");

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

global.googlePayService = new GooglePayService(
    {
        tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            // other:
            gateway: "example",
            gatewayMerchantId: "exampleGatewayMerchantId",
        },
        allowedCardNetworks: ["VISA", "MASTERCARD"],
        allowedCardAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
    },
    "Example Merchant",
    "ENVIRONMENT_TEST",
);

global.db = SQLite.openDatabase(
    {
        name: "SQLite",
        location: "default",
        createFromLocation: "~SQLite.db",
    },
    () => console.log("SUCCESS OPEN DB"),
    (error: any) => console.error("ERROR: " + error),
);
