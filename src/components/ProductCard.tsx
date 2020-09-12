import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globals, globalStylesheet} from "../../resources/styles";
import CardIcon from "../../resources/assets/drawable/cart_icon.svg";
import DatabaseApi, {TKey} from "../database/DatabaseApi";
import Product from "../entities/Product";

export interface IProductCardState {}

export interface IProductCardProps {
    width: number;
    height: number;
    product: Product;
    style?: any;
}

class ProductCard extends Component<Readonly<IProductCardProps>, Readonly<IProductCardState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    private addToCart(productId: TKey) {
        // TODO notify to MainScreen new cart price
        DatabaseApi.addProductToCart(productId);
    }

    render() {
        const {width, height, product, style} = this.props;

        return (
            <View
                style={{
                    width: width,
                    height: height,
                    ...stylesheet.container,
                    ...style,
                }}>
                <Image
                    source={require("../../resources/assets/drawable/food.jpg")}
                    style={{
                        width: width - 2 * stylesheet.container.padding,
                        height: (width - 2 * stylesheet.container.padding) / 1.2,
                        borderRadius: 20,
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        marginTop: 2,
                    }}>
                    <View style={{maxWidth: 100, justifyContent: "flex-end"}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                marginTop: 5,
                                ...globalStylesheet.primaryText,
                            }}>
                            {product.name}
                        </Text>
                        <Text numberOfLines={1} style={globalStylesheet.crossedOutPrice}>
                            {product.discountPrice}
                        </Text>
                        <Text numberOfLines={1} style={globalStylesheet.price}>
                            {product.price}
                        </Text>
                    </View>
                    <View style={stylesheet.shoppingCartButtonContainer}>
                        <TouchableOpacity
                            style={stylesheet.shoppingCartButton}
                            activeOpacity={0.85}
                            onPress={() => this.addToCart(product.id)}>
                            <CardIcon
                                width={20}
                                height={20}
                                fill={globals.cardBackgroundColor}
                                style={{position: "absolute"}}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: globals.cardBackgroundColor,

        shadowColor: globals.shadowColor,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    shoppingCartButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: globals.primaryColor,
        width: 38,
        height: 38,
        opacity: 0.5,
    },
    shoppingCartButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ProductCard;
