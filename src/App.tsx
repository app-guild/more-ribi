import "react-native-gesture-handler";
import * as React from "react";
import {useEffect} from "react";
import SplashScreen from "react-native-splash-screen";
import Navigation from "./components/Navigation";

export default function App() {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    return <Navigation />;
}
