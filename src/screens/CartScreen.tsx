import React, {Component} from "react";
import {Button, FlatList, StyleSheet, Text, View} from "react-native";
import Cart from "../entities/Cart";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";
import {globalColors, globalStylesheet} from "../../resources/styles";

const FISH_ICON_BACK_SIZE = {width: 47, height: 17};

export interface ICartScreenState {
    cart: Cart;
}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <View style={globalStylesheet.headerContainer}>
                    <View style={globalStylesheet.header}>
                        <FishIcon
                            width={FISH_ICON_BACK_SIZE.width}
                            height={FISH_ICON_BACK_SIZE.height}
                            style={globalStylesheet.headerFishBackButton}
                            onTouchEnd={() => this.props.navigation.goBack()}
                        />
                        <Text style={globalStylesheet.headerText}>Ваш улов:</Text>
                    </View>
                </View>
                <FlatList data={} renderItem={}
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default CartScreen;
