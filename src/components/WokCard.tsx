import React from "react";
import {Image, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Ingredient from "../entities/Ingredient";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {IProductCardProps, IProductCardState, stylesheet as productCardStylesheet} from "./ProductCard";
import {Picker} from "@react-native-community/picker";
import ProductCard from "./ProductCard";
import DatabaseApi from "../utils/database/DatabaseApi";
import PriceButton from "./PriceButton";
import WokProduct from "../entities/WokProduct";
import Cart from "../entities/Cart";
import Product from "../entities/Product";
import OpenDish from "./OpenDish";
import {ProductType} from "../entities/ProductType";
import Modal from "react-native-modal";

export interface IWokCardProps extends IProductCardProps {
    baseIngredients: Ingredient[];
    sauceIngredients: Ingredient[];
}

export interface IWokCardState extends IProductCardState {
    basePicker: string;
    saucePicker: string;
    basePickerVisible: boolean;
    saucePickerVisible: boolean;
}

class WokCard extends ProductCard<IWokCardProps, IWokCardState> {
    constructor(props: IWokCardProps) {
        super(props);
        this.state = {
            countInCart: 0,
            basePicker: props.baseIngredients[0] ? props.baseIngredients[0].name : "",
            saucePicker: props.sauceIngredients[0] ? props.sauceIngredients[0].name : "",
            basePickerVisible: false,
            saucePickerVisible: false,
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
                                {Platform.OS === "ios" ? (
                                    <>
                                        <TouchableOpacity
                                            style={stylesheet.iosPickerLabel}
                                            onPress={() => this.setState({basePickerVisible: true})}>
                                            <Text style={{...globalStylesheet.secondaryText, fontSize: 14}}>
                                                {this.state.basePicker}
                                            </Text>
                                        </TouchableOpacity>
                                        <Modal
                                            isVisible={this.state.basePickerVisible}
                                            animationIn={"zoomInUp"}
                                            animationOut={"zoomOutUp"}
                                            backdropOpacity={0}
                                            style={{margin: 0}}
                                            onBackdropPress={() => {
                                                this.setState({basePickerVisible: false});
                                            }}
                                            onBackButtonPress={() => {
                                                this.setState({basePickerVisible: false});
                                            }}>
                                            <View style={stylesheet.iosPickerContainer}>
                                                <Picker
                                                    mode={"dropdown"}
                                                    selectedValue={this.state.basePicker}
                                                    onValueChange={(itemValue) =>
                                                        this.setState({basePicker: itemValue.toString()})
                                                    }>
                                                    {baseIngredients.map((value, i) => (
                                                        <Picker.Item key={i} label={value.name} value={value.name} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </Modal>
                                    </>
                                ) : (
                                    <Picker
                                        mode={"dropdown"}
                                        selectedValue={this.state.basePicker}
                                        style={stylesheet.pricker}
                                        onValueChange={(itemValue) =>
                                            this.setState({basePicker: itemValue.toString()})
                                        }>
                                        {baseIngredients.map((value, i) => (
                                            <Picker.Item key={i} label={value.name} value={value.name} />
                                        ))}
                                    </Picker>
                                )}
                            </View>
                            <View style={stylesheet.pickerContainer}>
                                {Platform.OS === "ios" ? (
                                    <>
                                        <TouchableOpacity
                                            style={stylesheet.iosPickerLabel}
                                            onPress={() => this.setState({saucePickerVisible: true})}>
                                            <Text style={{...globalStylesheet.secondaryText, fontSize: 14}}>
                                                {this.state.saucePicker}
                                            </Text>
                                        </TouchableOpacity>
                                        <Modal
                                            isVisible={this.state.saucePickerVisible}
                                            animationIn={"zoomInUp"}
                                            animationOut={"zoomOutUp"}
                                            backdropOpacity={0}
                                            style={{margin: 0}}
                                            onBackdropPress={() => {
                                                this.setState({saucePickerVisible: false});
                                            }}
                                            onBackButtonPress={() => {
                                                this.setState({saucePickerVisible: false});
                                            }}>
                                            <View style={stylesheet.iosPickerContainer}>
                                                <Picker
                                                    mode={"dropdown"}
                                                    selectedValue={this.state.saucePicker}
                                                    onValueChange={(itemValue) =>
                                                        this.setState({saucePicker: itemValue.toString()})
                                                    }>
                                                    {sauceIngredients.map((value, i) => (
                                                        <Picker.Item key={i} label={value.name} value={value.name} />
                                                    ))}
                                                </Picker>
                                            </View>
                                        </Modal>
                                    </>
                                ) : (
                                    <Picker
                                        mode={"dropdown"}
                                        selectedValue={this.state.saucePicker}
                                        style={stylesheet.pricker}
                                        onValueChange={(itemValue) =>
                                            this.setState({saucePicker: itemValue.toString()})
                                        }>
                                        {sauceIngredients.map((value, i) => (
                                            <Picker.Item key={i} label={value.name} value={value.name} />
                                        ))}
                                    </Picker>
                                )}
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
    pricker: {
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
