import React, {Component} from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {globals, globalStylesheet} from "../../resources/styles";
import {stylesheet as productCardStyleseet} from "../components/ProductCard";
// import MenuIcon from "./../../resources/assets/drawable/menu_icon.svg";
// import CartIcon from "./../../resources/assets/drawable/cart_icon.svg";
// import FishIcon from "./../../resources/assets/drawable/fish_icon2.svg";
// import FishBackButton from "./../../resources/assets/drawable/fish_back_button.svg";
// import {DrawerNavigationProp} from "@react-navigation/drawer";

export interface IOpenDishState {}
export interface IOpenDishProps {
    width: number;
    image?: any;
    name: string;
    composition: string;
    price: string;
    crossOutPrice?: number;
}

class OpenDish extends Component<
    Readonly<IOpenDishProps>,
    Readonly<IOpenDishState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        const {
            width,
            //height,
            name,
            composition,
            price,
            crossOutPrice,
            image,
            style,
        } = this.props;
        const widthWithoutPadding =
            width - 2 * stylesheet.container.paddingHorizontal;
        return (
            <View
                style={{
                    ...productCardStyleseet.container,
                    ...stylesheet.container,
                    width: width,
                }}>
                <Image
                    source={require("../../resources/assets/drawable/food.jpg")}
                    style={{
                        width: widthWithoutPadding,
                        height: widthWithoutPadding,
                        borderRadius: 10,
                    }}
                />
                <Text style={stylesheet.title}>{name}</Text>
                <Text style={stylesheet.composition}>{composition}</Text>
                <View
                    style={{
                        //flexDirection: "row",
                        //alignItems: "center",
                        marginTop: 13,
                        //paddingRight: width / 2,
                        //width: widthWithoutPadding,
                    }}>
                    <Text
                        style={{
                            ...stylesheet.crossOutPrice,
                            position: "absolute",
                            left: 30,
                        }}>
                        {crossOutPrice}
                    </Text>
                    <Text
                        style={{
                            ...stylesheet.price,
                            left: widthWithoutPadding / 2 - 30,
                        }}>
                        {price}
                    </Text>
                </View>
                <TouchableOpacity
                    style={stylesheet.addToCartButton}
                    onPress={() => {}}
                    activeOpacity={0.85}>
                    <Text style={stylesheet.addToCartText}>
                        Добавить в корзину
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingHorizontal: 23,
        paddingVertical: 27,
    },
    title: {
        ...globalStylesheet.primaryText,
        fontSize: 24,
        lineHeight: 30,
        marginTop: 10,
    },
    composition: {
        ...globalStylesheet.secondaryText,
        fontSize: 14,
        lineHeight: 18,
        marginTop: 6,
    },
    price: {
        ...globalStylesheet.price,
        fontSize: 18,
        lineHeight: 23,
    },
    crossOutPrice: {
        ...globalStylesheet.crossedOutPrice,
        fontSize: 14,
        lineHeight: 23,
    },
    addToCartButton: {
        paddingVertical: 11,
        paddingHorizontal: 22,
        backgroundColor: globals.primaryColor,
        borderRadius: 7,
        opacity: productCardStyleseet.shoppingCartButton.opacity,
        alignSelf: "center",
        marginTop: 15,
    },
    addToCartText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
        color: globals.categoryCardTextColor,
    },
});

export default OpenDish;
