import React, {Component} from "react";
import {Animated, Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import Product from "../entities/Product";
import DatabaseApi, {TKey} from "../utils/database/DatabaseApi";
import NumericInput from "react-native-numeric-input";
const timer = require("react-native-timer");

const REPLACE_DURATION = 3000;
const REPLACE_DELAY = 700;

export interface IOpenDishState {
    productCount: number;
}
export interface IOpenDishProps {
    width: number;
    height: number;
    product: Product | null;
}

class OpenDish extends Component<Readonly<IOpenDishProps>, Readonly<IOpenDishState>> {
    private mainAnimValue = new Animated.Value(0);
    private buttonFadeAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });
    private counterFadeAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });
    private buttonMoveAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, -5, 50],
    });
    private counterMoveAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [50, -5, 0],
    });

    constructor(props: any) {
        super(props);
        this.state = {
            productCount: 0,
        };
    }

    componentDidMount() {
        DatabaseApi.getCart().then((cart) => {
            const count = cart.products.filter((prod) => prod.id === this.props.product?.id).length;
            this.setState({productCount: count});
        });
    }

    private async addToCartFromButton(productId: TKey) {
        this.replaceButtonWithCounter();
        return DatabaseApi.addProductToCart(productId);
    }

    private async addToCartFromCounter(productId: TKey) {
        this.refreshFadeOutTimer();
        return DatabaseApi.addProductToCart(productId);
    }

    private async removeFromCartFromCounter(productId: TKey) {
        this.refreshFadeOutTimer();
        return DatabaseApi.removeProductFromCart(productId);
    }

    private replaceButtonWithCounter() {
        Animated.timing(this.mainAnimValue, {
            useNativeDriver: false,
            toValue: 1,
            duration: REPLACE_DELAY,
        }).start();

        timer.setTimeout(
            this,
            "fadeOut",
            () => {
                Animated.timing(this.mainAnimValue, {
                    useNativeDriver: false,
                    toValue: 0,
                    duration: REPLACE_DELAY,
                }).start();
            },
            REPLACE_DURATION,
        );
    }

    private refreshFadeOutTimer() {
        timer.clearTimeout(this, "fadeOut");
        timer.setTimeout(
            this,
            "fadeOut",
            () => {
                Animated.timing(this.mainAnimValue, {
                    useNativeDriver: false,
                    toValue: 0,
                    duration: REPLACE_DELAY,
                }).start();
            },
            REPLACE_DURATION,
        );
    }

    render() {
        const {width, product} = this.props;
        const widthWithoutPadding = width - 2 * stylesheet.container.paddingHorizontal;

        return product !== null ? (
            <View style={stylesheet.container}>
                <Image
                    source={require("../../resources/assets/drawable/food.jpg")}
                    style={{
                        width: widthWithoutPadding,
                        maxHeight: widthWithoutPadding,
                        flex: 1,
                        resizeMode: "cover",
                        borderRadius: 10,
                    }}
                />
                <Text style={stylesheet.title}>{product.name}</Text>
                <Text style={{...stylesheet.composition, maxWidth: widthWithoutPadding}}>{product.composition}</Text>
                <View style={stylesheet.priceContainer}>
                    <Text style={stylesheet.crossOutPrice}>
                        {product.discountPrice ? product.discountPrice + " руб" : ""}
                    </Text>
                    <Text style={stylesheet.price}>{product.price + " руб"}</Text>
                </View>
                <View style={stylesheet.addToCartContainer}>
                    <Animated.View
                        style={{
                            ...stylesheet.addToCartButtonAnim,
                            top: this.buttonMoveAnimValue,
                            opacity: this.buttonFadeAnimValue,
                        }}>
                        <TouchableOpacity
                            style={{...stylesheet.addToCartButton, maxWidth: widthWithoutPadding}}
                            onPress={async () => this.addToCartFromButton(product.id)}
                            activeOpacity={0.5}>
                            <Text style={stylesheet.addToCartText}>Добавить в корзину</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View
                        style={{
                            ...stylesheet.addToCartNumericInput,
                            top: this.counterMoveAnimValue,
                            opacity: this.counterFadeAnimValue,
                        }}>
                        <NumericInput
                            containerStyle={{
                                borderColor: globalColors.transparent,
                            }}
                            inputStyle={{
                                borderColor: globalColors.transparent,
                            }}
                            iconStyle={{
                                color: globalColors.mainBackgroundColor,
                            }}
                            leftButtonBackgroundColor={globalColors.primaryColor}
                            rightButtonBackgroundColor={globalColors.primaryColor}
                            textColor={globalColors.primaryColor}
                            minValue={0}
                            rounded={true}
                            initValue={this.state.productCount}
                            onChange={async (value) => {
                                if (value > this.state.productCount) {
                                    return this.addToCartFromCounter(product?.id);
                                } else if (value < this.state.productCount) {
                                    return this.removeFromCartFromCounter(product?.id);
                                }
                                return;
                            }}
                        />
                    </Animated.View>
                </View>
            </View>
        ) : (
            <></>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        position: "relative",
        paddingHorizontal: 23,
        paddingVertical: 27,
        borderRadius: 20,
        backgroundColor: globalColors.cardBackgroundColor,
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
    addToCartContainer: {
        position: "relative",
        alignSelf: "center",
        marginTop: 15,
        width: "100%",
    },
    addToCartButtonAnim: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    addToCartButton: {
        paddingVertical: 11,
        paddingHorizontal: 22,
        marginTop: 15,
        backgroundColor: globalColors.primaryColor,
        borderRadius: 7,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    addToCartNumericInput: {
        paddingVertical: 11,
        paddingHorizontal: 22,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    addToCartText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
        color: globalColors.categoryCardTextColor,
    },
});

export default OpenDish;
