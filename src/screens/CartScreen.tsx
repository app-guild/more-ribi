import React, {Component} from "react";
import {Button, Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";

export interface ICartScreenState {}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
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
