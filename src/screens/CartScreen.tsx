import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import Cart from "../entities/Cart";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import CartItem from "../components/CartItem";
import Product from "../entities/Product";
import {TouchableOpacity} from "react-native-gesture-handler";

const FISH_ICON_BACK_SIZE = {width: 47, height: 17};

export interface ICartScreenState {
    cart: Cart;
}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            cart: new Cart(-1, new Map<Product, number>()),
        };
        this.updateCart = this.updateCart.bind(this);
    }

    componentDidMount() {
        return DatabaseApi.getCart()
            .then(this.updateCart)
            .then(() => DatabaseApi.addOnCartChangeListener(this.updateCart));
    }

    componentWillUnmount() {
        return DatabaseApi.removeOnCartChangeListener(this.updateCart);
    }

    private updateCart(cart: Cart) {
        this.setState({cart});
    }

    // @ts-ignore
    private renderItem({item}) {
        if (item instanceof Product) {
            return <CartItem product={item} />;
        } else {
            return <View />;
        }
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.bodyContainer}>
                    <FlatList data={this.state.cart.products} renderItem={this.renderItem} />
                    <View>
                        <View style={stylesheet.totalPriceContainer}>
                            <Text style={stylesheet.totalPriceText}>Итого: </Text>
                            <Text style={stylesheet.totalPriceText}>{this.state.cart.totalPrice + " ₽"}</Text>
                        </View>
                        <TouchableOpacity
                            style={stylesheet.orderButton}
                            onPress={() => this.props.navigation.navigate("CreateOrderScreen")}>
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
        color: globalColors.additionalTextColor,
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
