import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import CartIcon from "../../resources/assets/drawable/cart_icon.svg";
import DatabaseApi, {TKey} from "../database/DatabaseApi";
import Product from "../entities/Product";
import {Dimension} from "recyclerlistview";

const CART_FOOTER_HEIGHT = 60;

export interface IProductCardState {}

export interface IProductCardProps {
    width: number;
    height: number;
    product: Product;
    style?: any;
    onClick: (product: Product) => any;
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

    public static countCardSize(containerSize: Dimension): Dimension {
        const width = containerSize.width / 2 - 2 * stylesheet.container.marginHorizontal - 0.0001;
        const height = width + CART_FOOTER_HEIGHT;

        return {width: width, height: height};
    }

    render() {
        const {width, height, product, onClick, style} = this.props;
        const cartButtonSize = {width: width / 3.5, height: width / 3.5};
        const cartIconSize = {width: cartButtonSize.width * 0.6, height: cartButtonSize.width * 0.6};
        const imageSize = {
            width: width - 2 * stylesheet.container.padding,
            height: (width - 2 * stylesheet.container.padding) / 1.2,
        };

        return (
            <View
                style={{
                    width: width,
                    height: height,
                    ...stylesheet.container,
                    ...style,
                }}>
                <View
                    onTouchEnd={() => {
                        onClick(product);
                    }}>
                    <Image
                        source={require("../../resources/assets/drawable/food.jpg")}
                        style={{
                            ...imageSize,
                            borderRadius: 20,
                        }}
                    />
                </View>
                <View style={stylesheet.shoppingCartFooter}>
                    <View style={stylesheet.shoppingCartFooterText}>
                        <Text numberOfLines={2} style={globalStylesheet.primaryText}>
                            {product.name}
                        </Text>
                        <Text numberOfLines={1} style={globalStylesheet.crossedOutPrice}>
                            {product.discountPrice ? product.discountPrice + " руб" : ""}
                        </Text>
                        <Text numberOfLines={1} style={globalStylesheet.price}>
                            {product.price + " руб"}
                        </Text>
                    </View>
                    <View style={stylesheet.shoppingCartButtonContainer}>
                        <TouchableOpacity
                            style={{
                                ...stylesheet.shoppingCartButton,
                                ...cartButtonSize,
                            }}
                            activeOpacity={0.85}
                            onPress={() => this.addToCart(product.id)}>
                            <CartIcon
                                width={cartIconSize.width}
                                height={cartIconSize.height}
                                fill={globalColors.cardBackgroundColor}
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
        marginHorizontal: 10,
        borderRadius: 20,
        padding: 10,
        backgroundColor: globalColors.cardBackgroundColor,

        shadowColor: globalColors.shadowColor,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        justifyContent: "space-between",
    },
    shoppingCartButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: globalColors.primaryColor,
    },
    shoppingCartFooterText: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        width: "70%",
    },
    shoppingCartFooter: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
    },
    shoppingCartButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
});

export default ProductCard;
