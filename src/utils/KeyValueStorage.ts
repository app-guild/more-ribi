import AsyncStorage from "@react-native-community/async-storage";
import Address from "../entities/Address";
import {parsePaymentsMethods, PaymentsMethods} from "./payment/PaymentsMethods";

export default class KeyValueStorage {
    static getUserName(): Promise<string> {
        return AsyncStorage.getItem("username").then((username) => username || "");
    }

    static setUserName(username: string): Promise<void> {
        return AsyncStorage.setItem("username", username);
    }

    static getLastPaymentMethod(): Promise<PaymentsMethods | null> {
        return AsyncStorage.getItem("payment_method").then((paymentMethod) =>
            paymentMethod ? parsePaymentsMethods(paymentMethod) : null,
        );
    }

    static setLastPaymentMethod(paymentMethod: PaymentsMethods): Promise<void> {
        return AsyncStorage.setItem("payment_method", paymentMethod);
    }

    static getPhoneNumber(): Promise<string> {
        return AsyncStorage.getItem("phone").then((phone) => phone || "");
    }

    static setPhoneNumber(phone: string): Promise<void> {
        return AsyncStorage.setItem("phone", phone);
    }

    static getAddress(): Promise<Address | null> {
        return AsyncStorage.getItem("address").then((address) =>
            address ? Address.parseDatabaseAddress(JSON.parse(address)) : null,
        );
    }

    static setAddress(address: Address): Promise<void> {
        return AsyncStorage.setItem("address", JSON.stringify(address));
    }
}
