/**
 * @format
 */

import {AppRegistry} from "react-native";
import App from "./src/App";
import {name as appName} from "./app.json";
// import GPay from "react-native-gpay";
//
// global.GPay = GPay;

AppRegistry.registerComponent(appName, () => App);
