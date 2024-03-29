import React, {Component} from "react";
import {Animated, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import Product from "../entities/Product";
import DatabaseApi from "../utils/database/DatabaseApi";
import NumericInput from "react-native-numeric-input";
import {ProductType} from "../entities/ProductType";
import Ingredient from "../entities/Ingredient";
import WokCard from "./WokCard";
import WokProduct from "../entities/WokProduct";
import {Overlay} from "react-native-elements";
import AdaptPicker from "./AdaptPicker";

const timer = require("react-native-timer");

const REPLACE_DURATION = 3000;
const REPLACE_DELAY = 700;

export interface IOpenDishState {
    productCount: number;
    modalVisible: boolean;
    basePicker?: string;
    saucePicker?: string;
    saucePickerVisible: boolean;
    basePickerVisible: boolean;
}
export interface IOpenDishProps {
    width: number;
    height: number;
    product: Product | null;
    baseIngredients?: Ingredient[];
    sauceIngredients?: Ingredient[];
}

class OpenDish extends Component<Readonly<IOpenDishProps>, Readonly<IOpenDishState>> {
    private mainAnimValue = new Animated.Value(0);
    private buttonFadeAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [1, 0, 0],
    });
    private counterFadeAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [0, 0, 1],
    });
    private buttonMoveAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 0.2, 1],
        outputRange: [0, -5, 500],
    });
    private counterMoveAnimValue = this.mainAnimValue.interpolate({
        inputRange: [0, 0.8, 1],
        outputRange: [500, -5, 0],
    });

    constructor(props: IOpenDishProps) {
        super(props);
        this.state = {
            modalVisible: false,
            productCount: 0,
            basePickerVisible: false,
            saucePickerVisible: false,
        };
        if (props.product?.type === ProductType.Wok) {
            this.state = {
                productCount: 0,
                modalVisible: false,
                basePickerVisible: false,
                saucePickerVisible: false,
                basePicker: props.baseIngredients[0] ? props.baseIngredients[0].name : "",
                saucePicker: props.sauceIngredients[0] ? props.sauceIngredients[0].name : "",
            };
        }
        this.addToCartFromButton = this.addToCartFromButton.bind(this);
        this.onWokRecipeUpdate = this.onWokRecipeUpdate.bind(this);
    }

    componentDidMount() {
        return this.updateProduct();
    }

    shouldComponentUpdate(nextProps: Readonly<IOpenDishProps>, nextState: Readonly<IOpenDishState>): boolean {
        if (
            nextProps.product !== this.props.product ||
            nextState.basePicker !== this.state.basePicker ||
            nextState.saucePicker !== this.state.saucePicker ||
            nextState.modalVisible !== this.state.modalVisible
        ) {
            this.updateProduct();
        }
        return true;
    }

    private updateProduct = (): Promise<void> => {
        return DatabaseApi.getCart().then((cart) => {
            if (this.props.product) {
                let productCount = 0;
                if (this.props.product.type !== ProductType.Wok) {
                    productCount = cart.getProductCount(this.props.product);
                } else if (this.props.product instanceof WokProduct) {
                    productCount = cart.getProductCount(this.getWokProduct(this.props.product));
                }
                console.log(productCount);
                this.setState({productCount}, () => {
                    if (productCount > 0) {
                        this.replaceButtonWithCounter();
                    } else {
                        this.replaceCounterWithButton();
                    }
                });
            }
        });
    };

    public showModal() {
        this.setState({
            modalVisible: true,
            basePicker:
                this.props.baseIngredients && this.props.baseIngredients[0]
                    ? this.props.baseIngredients[0].name
                    : undefined,
            saucePicker:
                this.props.sauceIngredients && this.props.sauceIngredients[0]
                    ? this.props.sauceIngredients[0].name
                    : undefined,
        });
    }

    public hideModal() {
        this.setState({modalVisible: false});
    }

    private async onWokRecipeUpdate(basePicker?: string, saucePicker?: string) {
        this.setState({
            basePicker: basePicker ? basePicker : this.state.basePicker,
            saucePicker: saucePicker ? saucePicker : this.state.saucePicker,
        });
        return this.updateProduct();
    }

    private getWokProduct(product: Product, basePicker?: string, saucePicker?: string): WokProduct {
        const base = basePicker ? basePicker : this.state.basePicker;
        const sauce = saucePicker ? saucePicker : this.state.saucePicker;
        return WokCard.createWokProduct(product, base ? base : "", sauce ? sauce : "");
    }

    private async addToCartFromButton(product: Product) {
        this.replaceButtonWithCounter();
        return this.updateProductCount(product, this.state.productCount + 1);
    }

    private async addToCartFromCounter(product: Product, count: number) {
        this.refreshFadeOutTimer();
        return this.updateProductCount(product, count);
    }

    private async removeFromCartFromCounter(product: Product, count: number) {
        this.refreshFadeOutTimer();
        return this.updateProductCount(product, count);
    }

    private async updateProductCount(product: Product, count: number) {
        return new Promise<void>((resolve) => {
            if (this.state.productCount > 0 && count > 0) {
                resolve(DatabaseApi.updateProductCount(product, count));
            } else if (this.state.productCount === 0) {
                resolve(DatabaseApi.addProductToCart(product, count));
            } else if (count === 0) {
                resolve(DatabaseApi.removeProductFromCart(product));
            }
        }).then(() => {
            this.setState({productCount: count}, () => {
                if (this.state.productCount > 0) {
                    this.replaceButtonWithCounter();
                } else {
                    this.replaceCounterWithButton();
                }
            });
        });
    }

    private replaceButtonWithCounter() {
        Animated.timing(this.mainAnimValue, {
            useNativeDriver: false,
            toValue: 1,
            duration: REPLACE_DELAY,
        }).start();
    }

    private replaceCounterWithButton() {
        Animated.timing(this.mainAnimValue, {
            useNativeDriver: false,
            toValue: 0,
            duration: REPLACE_DELAY,
        }).start();
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

    private renderPrice(price: number, discountPrice?: number | null) {
        const crossOutPrice = discountPrice ? price + " ₽" : "";
        const mainPrice = discountPrice ? discountPrice + " ₽" : price + " ₽";
        return (
            <View style={stylesheet.priceContainer}>
                <Text style={stylesheet.crossOutPrice}>{crossOutPrice}</Text>
                <Text style={stylesheet.price}>{mainPrice}</Text>
            </View>
        );
    }

    render() {
        const {width, product} = this.props;
        const baseIngredients = this.props.baseIngredients ? this.props.baseIngredients : [];
        const sauceIngredients = this.props.sauceIngredients ? this.props.sauceIngredients : [];

        const widthWithoutPadding = width - 2 * stylesheet.container.paddingHorizontal;
        const image = product?.image ? {uri: product.image} : require("../../resources/assets/drawable/food.jpg");

        return (
            <Overlay
                isVisible={this.state.modalVisible}
                onBackdropPress={() => {
                    this.hideModal();
                }}>
                {product !== null ? (
                    <View style={stylesheet.container}>
                        <ScrollView>
                            <Image
                                source={image}
                                style={{
                                    width: widthWithoutPadding,
                                    height: widthWithoutPadding,
                                    borderRadius: 10,
                                }}
                            />
                            <Text style={stylesheet.title}>{product.name}</Text>

                            {product.type === ProductType.Wok ? (
                                <View>
                                    <Text
                                        style={{
                                            ...stylesheet.composition,
                                            maxWidth: widthWithoutPadding,
                                            textAlign: "center",
                                        }}>
                                        Выберите основу и соус:
                                    </Text>
                                    <View style={stylesheet.pickers}>
                                        <View style={stylesheet.pickerContainer}>
                                            <AdaptPicker
                                                items={baseIngredients.map((it) => it.name)}
                                                onValueChange={(newValue: string) =>
                                                    this.setState({basePicker: newValue})
                                                }
                                            />
                                        </View>
                                        <View style={stylesheet.pickerContainer}>
                                            <AdaptPicker
                                                items={sauceIngredients.map((it) => it.name)}
                                                onValueChange={(newValue: string) =>
                                                    this.setState({saucePicker: newValue})
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            ) : (
                                <Text style={{...stylesheet.composition, maxWidth: widthWithoutPadding}}>
                                    {product.composition}
                                </Text>
                            )}
                            {this.renderPrice(product.price, product.discountPrice)}
                            <View style={stylesheet.addToCartContainer}>
                                <Animated.View
                                    style={{
                                        ...stylesheet.addToCartButtonAnim,
                                        top: this.buttonMoveAnimValue,
                                        opacity: this.buttonFadeAnimValue,
                                    }}>
                                    <TouchableOpacity
                                        style={stylesheet.addToCartButton}
                                        onPress={async () =>
                                            this.addToCartFromButton(
                                                product.type === ProductType.Wok
                                                    ? this.getWokProduct(product)
                                                    : product,
                                            )
                                        }
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
                                                return this.addToCartFromCounter(
                                                    product.type === ProductType.Wok
                                                        ? this.getWokProduct(product)
                                                        : product,
                                                    value,
                                                );
                                            } else if (value < this.state.productCount) {
                                                return this.removeFromCartFromCounter(
                                                    product.type === ProductType.Wok
                                                        ? this.getWokProduct(product)
                                                        : product,
                                                    value,
                                                );
                                            }
                                            return;
                                        }}
                                    />
                                </Animated.View>
                            </View>
                        </ScrollView>
                    </View>
                ) : (
                    <></>
                )}
            </Overlay>
        );
    }
}

export const stylesheet = StyleSheet.create({
    iosPickerContainer: {
        backgroundColor: globalColors.cardBackgroundColor,
        opacity: 0.8,
        height: "30%",
        alignContent: "center",
        justifyContent: "center",
        padding: 20,
    },
    iosPickerLabel: {
        width: "100%",
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        color: globalColors.additionalTextColor,
        backgroundColor: globalColors.almostTransparent,
    },
    container: {
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
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 10,
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
        fontFamily: "Montserrat-Bold",
        fontSize: 14,
        lineHeight: 17,
        color: globalColors.whiteTextColor,
    },
    pickerContainer: {
        width: "50%",
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
    pickers: {
        marginTop: 10,
        alignItems: "center",
    },
});

export default OpenDish;
