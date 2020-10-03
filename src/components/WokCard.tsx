import React from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ingredient from "../entities/Ingredient";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {IProductCardProps, IProductCardState, stylesheet as productCardStylesheet} from "./ProductCard";
import renderPrice from "./PriceButton";
import {Picker} from "@react-native-community/picker";
import ProductCard from "./ProductCard";

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
            basePicker: props.baseIngredients[0] ? props.baseIngredients[0].name : "",
            saucePicker: props.sauceIngredients[0] ? props.sauceIngredients[0].name : "",
        };
    }

    render() {
        const {product, onClick, baseIngredients, sauceIngredients} = this.props;
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
                    <View style={productCardStylesheet.shoppingCardSubContainer}>
                        <View style={stylesheet.pickers}>
                            <View style={stylesheet.pickerContainer}>
                                <Picker
                                    mode={"dropdown"}
                                    selectedValue={this.state.basePicker}
                                    style={stylesheet.pricker}
                                    onValueChange={(itemValue) => this.setState({basePicker: itemValue.toString()})}>
                                    {baseIngredients.map((value, i) => (
                                        <Picker.Item key={i} label={value.name} value={value.name} />
                                    ))}
                                </Picker>
                            </View>
                            <View style={stylesheet.pickerContainer}>
                                <Picker
                                    mode={"dropdown"}
                                    selectedValue={this.state.saucePicker}
                                    style={stylesheet.pricker}
                                    onValueChange={(itemValue) => this.setState({saucePicker: itemValue.toString()})}>
                                    {sauceIngredients.map((value, i) => (
                                        <Picker.Item key={i} label={value.name} value={value.name} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={productCardStylesheet.shoppingCartButtonContainer}>
                            <TouchableOpacity activeOpacity={0.85} onPress={this.addToCart}>
                                {renderPrice(product.price, this.state.countInCart, product.discountPrice)}
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
    pricker: {
        width: "140%",
        height: 20,
        padding: 0,
        margin: 0,
        color: globalColors.additionalTextColor,
    },
    pickers: {
        width: "50%",
    },
});

export default WokCard;
