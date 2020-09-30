import AsyncStorage from "@react-native-community/async-storage";

export default class KeyValueStorage {
    static getUserName(): Promise<string> {
        return AsyncStorage.getItem("username").then((username) => username || "");
    }

    static setUserName(username: string): Promise<void> {
        return AsyncStorage.setItem("username", username);
    }
}
