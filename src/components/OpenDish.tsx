import React, {Component} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globals, globalStylesheet} from "../../resources/styles";
import {stylesheet as productCardStylesheet} from "./ProductCard";
import {IProduct} from "../screens/MainScreen";

export interface IOpenDishState {}
export interface IOpenDishProps {
    width: number;
    height: number;
    image?: any;
    product: IProduct | null;
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
        const {width, height, product} = this.props;
        const widthWithoutPadding =
            width - 2 * stylesheet.container.paddingHorizontal;
        return product !== null ? (
            <View
                style={{
                    ...stylesheet.container,
                    width: width,
                    height: height,
                }}>
                <Image
                    source={require("../../resources/assets/drawable/food.jpg")}
                    style={{
                        width: widthWithoutPadding,
                        flex: 1,
                        resizeMode: "cover",
                        borderRadius: 10,
                    }}
                />
                <Text style={stylesheet.title}>{product.name}</Text>
                <Text style={stylesheet.composition}>
                    {product.composition}
                </Text>
                <View style={stylesheet.priceContainer}>
                    <Text style={stylesheet.crossOutPrice}>
                        {product.crossOutPrice
                            ? product.crossOutPrice + " руб"
                            : ""}
                    </Text>
                    <Text style={stylesheet.price}>
                        {product.price + " руб"}
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
        ) : (
            <></>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingHorizontal: 23,
        paddingVertical: 27,
        borderRadius: 20,
        backgroundColor: globals.cardBackgroundColor,

        shadowColor: globals.shadowColor,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,

        elevation: 4,
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
    priceContainer: {
        marginTop: 13,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
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
        right: 10,
    },
    addToCartButton: {
        paddingVertical: 11,
        paddingHorizontal: 22,
        backgroundColor: globals.primaryColor,
        borderRadius: 7,
        opacity: productCardStylesheet.shoppingCartButton.opacity,
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