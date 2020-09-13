import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import CardIcon from "../../resources/assets/drawable/cart_icon.svg";
import {IProduct} from "../screens/MainScreen";

export interface IProductCardState {}

export interface IProductCardProps {
    width: number;
    height: number;
    product: IProduct;
    //image?: any;
    style?: any;
    onClick: (product: IProduct) => any;
}

class ProductCard extends Component<
    Readonly<IProductCardProps>,
    Readonly<IProductCardState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }
    ongdgfdgdf() {}

    render() {
        const {
            width,
            height,
            product,
            //image,
            onClick,
            style,
        } = this.props;

        return (
            <View
                onTouchEnd={() => {
                    onClick(product);
                }}
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
                        height:
                            (width - 2 * stylesheet.container.padding) / 1.2,
                        borderRadius: 20,
                    }}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "space-between",
                        marginTop: 7,
                    }}>
                    <View style={{maxWidth: 100, justifyContent: "flex-end"}}>
                        <Text
                            numberOfLines={1}
                            style={{
                                //marginTop: 5,
                                ...globalStylesheet.primaryText,
                            }}>
                            {product.name}
                        </Text>
                        <Text
                            numberOfLines={1}
                            style={globalStylesheet.crossedOutPrice}>
                            {product.crossOutPrice
                                ? product.crossOutPrice + " руб"
                                : ""}
                        </Text>
                        <Text numberOfLines={1} style={globalStylesheet.price}>
                            {product.price + " руб"}
                        </Text>
                    </View>
                    <View style={stylesheet.shoppingCartButtonContainer}>
                        <TouchableOpacity
                            style={stylesheet.shoppingCartButton}
                            activeOpacity={0.85}>
                            <CardIcon
                                width={20}
                                height={20}
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
    },
    shoppingCartButton: {
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 50,
        backgroundColor: globalColors.primaryColor,
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
