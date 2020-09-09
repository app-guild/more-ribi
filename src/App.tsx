import "react-native-gesture-handler";
import * as React from "react";
import {useEffect} from 'react';
import SplashScreen from 'react-native-splash-screen';
import Navigation from "./components/Navigation";
import SQLite from "react-native-sqlite-storage";

export default function App() {
    useEffect(() => {
        SplashScreen.hide();
    }, []);
    return <Navigation />;
}

global.db = SQLite.openDatabase(
    {
        name: "SQLite",
        location: "default",
        createFromLocation: "~SQLite.db",
    },
    () => console.log("SUCCESS OPEN DB"),
    (error: any) => console.error("ERROR: " + error),
);
