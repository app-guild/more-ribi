import AsyncStorage from "@react-native-community/async-storage";
import Address from "../entities/Address";

export default class KeyValueStorage {
    static getUserName(): Promise<string> {
        return AsyncStorage.getItem("username").then((username) => username || "");
    }

    static setUserName(username: string): Promise<void> {
        return AsyncStorage.setItem("username", username);
    }

    static getPhoneNumber(): Promise<string> {
        return AsyncStorage.getItem("phone").then((phone) => phone || "");
    }

    static setPhoneNumber(phone: string): Promise<void> {
        return AsyncStorage.setItem("phone", phone);
    }

    static getAddress(): Promise<Address | null> {
        return AsyncStorage.getItem("address").then((address) => (address ? JSON.parse(address) : null));
    }

    static setAddress(address: Address): Promise<void> {
        return AsyncStorage.setItem("address", JSON.stringify(address));
    }
}
