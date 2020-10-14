import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import Cart from "../entities/Cart";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import CartItem from "../components/CartItem";
import Product from "../entities/Product";
import {TouchableOpacity} from "react-native-gesture-handler";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import {ProductType} from "../entities/ProductType";

const MIN_TOTAL_PRICE = 500;
const DELIVERY_PRICE = 120;
const delivery = new Product("Доставка", ProductType.None, DELIVERY_PRICE, undefined, true, "", "");

export interface ICartScreenState {
    cart: Cart;
    buttonEnabled: boolean;
}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
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
        RealtimeDatabaseApi.addProductsChangedListener(this.removeUnavailableProductsInCart);
        return DatabaseApi.getCart().then(this.updateCart);
    }

    removeUnavailableProductsInCart() {
        return DatabaseApi.removeUnavailableProductsFromCart()
            .then((unavailableProducts) => {
                // TODO show modal window with now unavailable products
                return;
            })
            .then(DatabaseApi.getCart)
            .then(this.updateCart);
    }

    componentWillUnmount() {
        return DatabaseApi.removeOnCartChangeListener(this.updateCart);
    }

    private async updateCart(cart: Cart) {
        let isEnabled = true;
        if (cart.products.length === 0 || (cart.products.length === 1 && cart.getProductCount(delivery) > 0)) {
            await DatabaseApi.removeProductFromCart(delivery);
            isEnabled = false;
        } else {
            let cartPrice = cart.totalPrice;
            const deliveryCount = cart.getProductCount(delivery);
            if (deliveryCount > 0) {
                cartPrice = cartPrice - deliveryCount * delivery.price;
            }
            if (cartPrice >= MIN_TOTAL_PRICE) {
                await DatabaseApi.removeProductFromCart(delivery);
            } else if (deliveryCount === 0) {
                await DatabaseApi.addProductToCart(delivery);
            }
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
                        {this.state.cart.getProductCount(delivery) > 0 ? (
                            <View style={stylesheet.totalPriceContainer}>
                                <Text style={stylesheet.deliveryTermText}>
                                    {`Доставка осуществляется бесплатно при заказе от ${MIN_TOTAL_PRICE}₽`}{" "}
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
