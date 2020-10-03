import React, {Component} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ingredient from "../entities/Ingredient";
import {globalColors} from "../../resources/styles";
import renderPrice from "./PriceButton";
import DatabaseApi from "../utils/database/DatabaseApi";
import Cart from "../entities/Cart";
import Product from "../entities/Product";
import {Picker} from "@react-native-community/picker";

export interface IWokCardProps {
    product: Product;
    baseIngredients: Ingredient[];
    sauceIngredients: Ingredient[];
    countInCart?: number;
    style?: any;
}

export interface IWokCardState {
    countInCart: number;
    basePicker: string;
    saucePicker: string;
}

class WokCard extends Component<Readonly<IWokCardProps>, Readonly<IWokCardState>> {
    constructor(props: IWokCardProps) {
        super(props);
        this.state = {
            countInCart: props.countInCart ? props.countInCart : 0,
            basePicker: props.baseIngredients[0].name, //? props.baseIngredients[0].name : "",
            saucePicker: props.sauceIngredients[0].name, //? props.sauceIngredients[0].name : "",
        };
        this.addToCart = this.addToCart.bind(this);
        this.setCountInCart = this.setCountInCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.setCountInCart);
        return DatabaseApi.getCart().then(this.setCountInCart);
    }

    componentDidUpdate(prevProps: Readonly<Readonly<IWokCardProps>>) {
        if (prevProps.product !== this.props.product) {
            DatabaseApi.getCart().then(this.setCountInCart);
        }
    }

    private setCountInCart(cart: Cart) {
        this.setState({countInCart: cart.getProductCount(this.props.product)});
    }
    private async addToCart() {
        // const product = this.props.product;
        // new Product(
        //     product.name,
        //     product.type,
        //     product.price,
        //     product.discountPrice,
        //     product.isAvailable,
        //     product.image,
        //     this.state.basePicker + ", " + this.state.saucePicker,
        // );
        if (this.state.countInCart === 0) {
            return DatabaseApi.addProductToCart(this.props.product);
        } else {
            return DatabaseApi.updateProductCount(this.props.product, this.state.countInCart + 1);
        }
    }
    render() {
        const {product, baseIngredients, sauceIngredients, style} = this.props;
        const image = product.image ? {uri: product.image} : require("../../resources/assets/drawable/food.jpg");
        return (
            <View style={{...stylesheet.container, ...style}}>
                <View style={stylesheet.card}>
                    <Image style={stylesheet.image} source={image} />
                    <View style={{flex: 1}}>
                        <Text style={stylesheet.name}>{product.name}</Text>
                        <View style={stylesheet.centredRow}>
                            <Text style={stylesheet.text}>Основа</Text>
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
                        </View>
                        <View style={stylesheet.centredRow}>
                            <Text style={stylesheet.text}>Соус</Text>
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
                        <View style={stylesheet.shoppingCartButtonContainer}>
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
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    card: {
        flexDirection: "row",
    },
    image: {
        width: "40%",
        aspectRatio: 1,
        borderRadius: 15,
        marginRight: 15,
    },
    name: {
        fontFamily: "Mulish",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 20,
        color: globalColors.mainTextColor,
    },
    text: {
        minWidth: 55,
        color: globalColors.additionalTextColor,
    },
    shoppingCartButtonContainer: {
        width: "50%",
        alignSelf: "flex-end",
        minWidth: 100,
        maxWidth: 150,
        marginTop: 10,
    },
    centredRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
    },
    pickerContainer: {
        maxWidth: 200,
        flex: 1,
        marginLeft: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: globalColors.primaryColor,
    },
    pricker: {
        width: "130%",
        height: 30,
        padding: 0,
        margin: 0,
        color: globalColors.additionalTextColor,
    },
});

export default WokCard;
