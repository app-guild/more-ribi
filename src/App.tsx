import "react-native-gesture-handler";
import * as React from "react";
import {useEffect} from "react";
import SplashScreen from "react-native-splash-screen";
import Navigation from "./components/Navigation";
import SQLite from "react-native-sqlite-storage";
import {GooglePayService} from "./utils/payment/GooglePayService";

export default function App() {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return <Navigation />;
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
