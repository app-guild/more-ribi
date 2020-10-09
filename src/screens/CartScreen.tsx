import React, {Component} from "react";
import {Button, Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import Cart from "../entities/Cart";

export interface ICartScreenState {
    cart: Cart;
}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Cart Screen</Text>
                <Button title={"Clear cart"} onPress={async () => DatabaseApi.clearCart()} />
            </View>
        );
    }
}

export default CartScreen;
