import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import Cart from "../entities/Cart";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import CartItem from "../components/CartItem";
import Product from "../entities/Product";
import {TouchableOpacity} from "react-native-gesture-handler";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";

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

    private updateCart(cart: Cart) {
        const isEnabled = cart.totalPrice >= 500;
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
