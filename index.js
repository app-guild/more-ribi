/**
 * @format
 */

import {AppRegistry} from "react-native";
import App from "./src/App";
import {name as appName} from "./app.json";
import RNTinkoffAsdk from "react-native-tinkoff-asdk";

RNTinkoffAsdk.init({
    terminalKey: "1605803895876DEMO",
    password: "m9b1fl8n5ujvrj3a",
    publicKey:
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv5yse9ka3ZQE0feuGtemYv3IqOlLck8zHUM7lTr0za6lXTszRSXfUO7jMb+L5C7e2QNFs+7sIX2OQJ6a+HG8kr+jwJ4tS3cVsWtd9NXpsU40PE4MeNr5RqiNXjcDxA+L4OsEm/BlyFOEOh2epGyYUd5/iO3OiQFRNicomT2saQYAeqIwuELPs1XpLk9HLx5qPbm8fRrQhjeUD5TLO8b+4yCnObe8vy/BMUwBfq+ieWADIjwWCMp2KTpMGLz48qnaD9kdrYJ0iyHqzb2mkDhdIzkim24A3lWoYitJCBrrB2xM05sm9+OdCI1f7nPNJbl5URHobSwR94IRGT7CJcUjvwIDAQAB",
    testMode: true,
    debugLog: true,
});

AppRegistry.registerComponent(appName, () => App);
