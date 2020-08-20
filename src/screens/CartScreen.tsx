import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface ICartScreenState {}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.centerBody}>
                <Text>Cart Screen</Text>
            </View>
        );
    }
}

export default CartScreen;
