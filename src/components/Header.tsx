import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";
import MenuIcon from "../../resources/assets/drawable/menu_icon.svg";
import CartIcon from "../../resources/assets/drawable/cart_icon.svg";
import TrashIcon from "../../resources/assets/drawable/delete_icon.svg";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import Cart from "../entities/Cart";
import DatabaseApi from "../utils/database/DatabaseApi";
import {StackNavigationProp} from "@react-navigation/stack";
import Product from "../entities/Product";

const MENU_ICON_SIZE = 40;
const CART_ICON_SIZE = 20;
const TRASH_ICON_SIZE = 30;

export interface IHeaderState {
    cart: Cart;
}
export interface IHeaderProps {
    screenTitle: string;
    isCartScreen?: boolean;
    drawerNavigation: DrawerNavigationProp<any>;
    stackNavigation: StackNavigationProp<any>;
}

class Header extends Component<Readonly<IHeaderProps>, Readonly<IHeaderState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            cart: new Cart(-1, new Map<Product, number>()),
        };
        this.updateCart = this.updateCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.updateCart);
        return DatabaseApi.getCart().then(this.updateCart);
    }

    componentWillUnmount() {
        DatabaseApi.removeOnCartChangeListener(this.updateCart);
    }

    clearCart() {
        return DatabaseApi.clearCart();
    }

    updateCart(cart: Cart) {
        this.setState({cart});
    }

    render() {
        let actionIcon = <View />;
        if (!this.props.isCartScreen && this.state.cart.totalPrice > 0) {
            actionIcon = (
                <View
                    style={stylesheet.topContainer}
                    onTouchEnd={() => this.props.stackNavigation.navigate("CartScreen")}>
                    <CartIcon width={CART_ICON_SIZE} height={CART_ICON_SIZE} fill={globalColors.primaryColor} />
                    <Text numberOfLines={1} style={stylesheet.priceText}>
                        {Math.round(this.state.cart.totalPrice)}
                    </Text>
                </View>
            );
        } else if (this.props.isCartScreen) {
            actionIcon = (
                <View style={stylesheet.topContainer} onTouchEnd={this.clearCart}>
                    <TrashIcon width={TRASH_ICON_SIZE} height={TRASH_ICON_SIZE} fill={globalColors.primaryColor} />
                </View>
            );
        }

        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.topContainer}>
                    <MenuIcon
                        width={MENU_ICON_SIZE}
                        height={MENU_ICON_SIZE}
                        onTouchEnd={this.props.drawerNavigation.openDrawer}
                    />
                    <Text style={stylesheet.title}>{this.props.screenTitle}</Text>
                </View>
                <View style={stylesheet.topContainer}>{actionIcon}</View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "100%",
        minHeight: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: globalColors.transparent,
    },
    title: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 24,
        lineHeight: 29,
        color: globalColors.primaryColor,
        marginLeft: 9,
    },
    subTitle: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 20,
        color: globalColors.primaryColor,
        marginRight: 7,
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    priceText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
        color: globalColors.primaryColor,
        marginLeft: 6,
    },
    categoryButton: {
        flexDirection: "row",
        marginLeft: 40,
        marginTop: 10,
    },
    categoryUnderline: {
        backgroundColor: globalColors.headerUnderlineColor,
        width: "auto",
        height: 2,
        marginLeft: 38,
        marginTop: 3,
    },
    fishBackButton: {
        marginLeft: 34,
        marginTop: 20,
        paddingBottom: 3,
    },
});

export default Header;
