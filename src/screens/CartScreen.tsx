import React, {Component, createRef} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import Cart from "../entities/Cart";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import CartItem from "../components/CartItem";
import Product from "../entities/Product";
import {TouchableOpacity} from "react-native-gesture-handler";
import {ProductType} from "../entities/ProductType";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import InfoModal from "../components/InfoModal";

export interface ICartScreenState {
    cart: Cart;
    buttonEnabled: boolean;
}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    private minTotalPrice: undefined | number;
    private deliveryPrice: undefined | number;
    private deliveryProduct: undefined | Product;

    private infoModal = createRef<InfoModal>();

    constructor(props: any) {
        super(props);
        this.state = {
            cart: new Cart(-1, new Map<Product, number>()),
            buttonEnabled: false,
        };
        this.updateCart = this.updateCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.updateCart);

        const promises = [];
        promises.push(
            RealtimeDatabaseApi.getMinimumOrderPrice().then(
                (minimumOrderPrice) => (this.minTotalPrice = minimumOrderPrice),
            ),
        );
        promises.push(
            RealtimeDatabaseApi.getDeliveryPrice().then((deliveryPrice) => (this.deliveryPrice = deliveryPrice)),
        );

        return Promise.all(promises).then(() => {
            if (this.deliveryPrice && this.minTotalPrice) {
                this.deliveryProduct = new Product(
                    "Доставка",
                    ProductType.None,
                    this.deliveryPrice!!,
                    undefined,
                    true,
                    "",
                    "",
                );
            }
            return DatabaseApi.getCart().then(this.updateCart);
        });
    }

    componentWillUnmount() {
        return DatabaseApi.removeOnCartChangeListener(this.updateCart);
    }

    private async updateCart(cart: Cart) {
        let isEnabled = true;

        if (this.deliveryProduct && this.deliveryPrice && this.minTotalPrice) {
            if (cart.products.length === 0) {
                isEnabled = false;
            } else if (cart.products.length === 1 && cart.getProductCount(this.deliveryProduct) > 0) {
                await DatabaseApi.removeProductFromCart(this.deliveryProduct);
                isEnabled = false;
            } else {
                let cartPrice = cart.totalPrice;
                const deliveryCount = cart.getProductCount(this.deliveryProduct);
                if (deliveryCount > 0) {
                    cartPrice = cartPrice - deliveryCount * this.deliveryProduct.price;
                }
                if (cartPrice >= this.minTotalPrice) {
                    if (deliveryCount > 0) {
                        await DatabaseApi.removeProductFromCart(this.deliveryProduct);
                    }
                } else if (deliveryCount === 0) {
                    await DatabaseApi.addProductToCart(this.deliveryProduct);
                }
            }
        } else {
            isEnabled = false;
        }
        this.setState({cart, buttonEnabled: isEnabled});
    }

    private renderItem({item}: any) {
        if (item instanceof Product) {
            return <CartItem product={item} />;
        } else {
            return <View />;
        }
    }

    render() {
        const buttonColor = this.state.buttonEnabled ? globalColors.primaryColor : globalColors.fadePrimaryColor;

        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.bodyContainer}>
                    <FlatList
                        data={this.state.cart.products}
                        renderItem={this.renderItem}
                        ListEmptyComponent={() => (
                            <Text style={{alignSelf: "center"}}>В корзине пока нет ни одного товара!</Text>
                        )}
                    />
                    <View>
                        {this.deliveryProduct && this.state.cart.getProductCount(this.deliveryProduct) > 0 ? (
                            <View style={stylesheet.totalPriceContainer}>
                                <Text style={stylesheet.deliveryTermText}>
                                    {`Доставка осуществляется бесплатно при заказе от ${this.minTotalPrice}₽`}{" "}
                                </Text>
                            </View>
                        ) : !this.deliveryProduct ? (
                            <View style={stylesheet.totalPriceContainer}>
                                <Text style={stylesheet.deliveryTermText}>
                                    {"Невозможно соединиться с сервером, проверьте соединение с интернетом"}{" "}
                                </Text>
                            </View>
                        ) : null}
                        <View style={stylesheet.totalPriceContainer}>
                            <Text style={stylesheet.totalPriceText}>Итого: </Text>
                            <Text style={stylesheet.totalPriceText}>{this.state.cart.totalPrice + " ₽"}</Text>
                        </View>
                        <TouchableOpacity
                            style={{...stylesheet.orderButton, backgroundColor: buttonColor}}
                            onPress={() => {
                                if (this.state.buttonEnabled) {
                                    this.props.navigation.navigate("CreateOrderScreen");
                                }
                            }}>
                            <Text style={stylesheet.orderButtonText}>ОФОРМИТЬ ЗАКАЗ</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <InfoModal ref={this.infoModal} />
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    bodyContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
    totalPriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginHorizontal: 10,
        marginVertical: 15,
    },
    totalPriceText: {
        ...globalStylesheet.primaryText,
        fontSize: 18,
        color: globalColors.primaryColor,
    },
    deliveryTermText: {
        ...globalStylesheet.primaryText,
        fontSize: 12,
    },
    orderButton: {
        width: "100%",
        paddingVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: globalColors.primaryColor,
    },
    orderButtonText: {
        ...globalStylesheet.primaryText,
        color: globalColors.mainBackgroundColor,
    },
});

export default CartScreen;
