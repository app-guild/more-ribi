import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ingredient from "../entities/Ingredient";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {IProductCardProps, IProductCardState, stylesheet as productCardStylesheet} from "./ProductCard";
import ProductCard from "./ProductCard";
import DatabaseApi from "../utils/database/DatabaseApi";
import PriceButton from "./PriceButton";
import WokProduct from "../entities/WokProduct";
import Cart from "../entities/Cart";
import Product from "../entities/Product";
import AdaptPicker from "./AdaptPicker";

export interface IWokCardProps extends IProductCardProps {
    baseIngredients: Ingredient[];
    sauceIngredients: Ingredient[];
}

export interface IWokCardState extends IProductCardState {
    basePicker: string;
    saucePicker: string;
}

class WokCard extends ProductCard<IWokCardProps, IWokCardState> {
    constructor(props: IWokCardProps) {
        super(props);
        this.state = {
            countInCart: 0,
            basePicker: props.baseIngredients[0] ? props.baseIngredients[0].name : "",
            saucePicker: props.sauceIngredients[0] ? props.sauceIngredients[0].name : "",
        };
        this.addToCart = this.addToCart.bind(this);
        this.setCountInCart = this.setCountInCart.bind(this);
    }

    protected async addToCart() {
        const currentProduct = WokCard.createWokProduct(
            this.props.product,
            this.state.basePicker,
            this.state.saucePicker,
        );
        DatabaseApi.getCart().then((cart) => {
            const productCount = cart.getProductCount(currentProduct);
            if (productCount === 0) {
                return DatabaseApi.addProductToCart(currentProduct);
            } else {
                return DatabaseApi.updateProductCount(currentProduct, productCount + 1);
            }
        });
    }

    protected setCountInCart(cart: Cart) {
        const {product} = this.props;
        const result = cart.getWokCount(product);
        this.setState({countInCart: result});
    }

    public static createWokProduct(product: Product, base: string, sauce: string): WokProduct {
        return new WokProduct(
            product.name,
            product.type,
            product.price,
            product.discountPrice,
            product.available,
            product.image,
            product.composition,
            base,
            sauce,
        );
    }

    render() {
        const {onClick, baseIngredients, sauceIngredients} = this.props;
        const product = WokCard.createWokProduct(this.props.product, this.state.basePicker, this.state.saucePicker);

        const image = product.image ? {uri: product.image} : require("../../resources/assets/drawable/food.jpg");

        return (
            <View style={productCardStylesheet.container}>
                <View
                    style={productCardStylesheet.shoppingCartImageContainer}
                    onTouchEnd={() => {
                        onClick(product);
                    }}>
                    <Image source={image} style={productCardStylesheet.shoppingCartImage} />
                </View>
                <View style={productCardStylesheet.shoppingCardMainContainer}>
                    <Text
                        numberOfLines={1}
                        style={{...globalStylesheet.primaryText, marginRight: 15}}
                        onPress={() => {
                            onClick(product);
                        }}>
                        {product.name}
                    </Text>
                    <Text style={globalStylesheet.secondaryText}>Выберите основу и соус:</Text>
                    <View style={productCardStylesheet.shoppingCardSubContainer}>
                        <View style={stylesheet.pickers}>
                            <View style={stylesheet.pickerContainer}>
                                <AdaptPicker
                                    items={baseIngredients.map((it) => it.name)}
                                    onValueChange={(newValue: string) => this.setState({basePicker: newValue})}
                                />
                            </View>
                            <View style={stylesheet.pickerContainer}>
                                <AdaptPicker
                                    items={sauceIngredients.map((it) => it.name)}
                                    onValueChange={(newValue: string) => this.setState({saucePicker: newValue})}
                                />
                            </View>
                        </View>
                        <View style={productCardStylesheet.shoppingCartButtonContainer}>
                            <TouchableOpacity activeOpacity={0.85} onPress={this.addToCart}>
                                <PriceButton
                                    price={product.price}
                                    countInCart={this.state.countInCart}
                                    discountPrice={product.discountPrice}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
export const stylesheet = StyleSheet.create({
    text: {
        minWidth: 55,
        color: globalColors.additionalTextColor,
    },
    centredRow: {
        flexDirection: "row",
        marginTop: 10,
        backgroundColor: "red",
    },
    pickerContainer: {
        width: "100%",
        marginTop: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: globalColors.primaryColor,
    },
    picker: {
        width: "140%",
        height: 30,
        paddingVertical: 10,
        padding: 0,
        margin: 0,
        color: globalColors.additionalTextColor,
        backgroundColor: globalColors.almostTransparent,
    },
    iosPickerLabel: {
        width: "100%",
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        color: globalColors.additionalTextColor,
        backgroundColor: globalColors.almostTransparent,
    },
    pickers: {
        width: "50%",
    },
    iosPickerContainer: {
        backgroundColor: globalColors.cardBackgroundColor,
        opacity: 0.8,
        height: "30%",
        alignContent: "center",
        justifyContent: "center",
        padding: 20,
    },
});

export default WokCard;
