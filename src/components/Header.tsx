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
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";
import Product from "../entities/Product";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";

const MENU_ICON_SIZE = 40;
const CART_ICON_SIZE = 20;
const FISH_ICON_SIZE = {width: 47, height: 17};
const TRASH_ICON_SIZE = 30;

export interface IHeaderState {
    cart: Cart;
}
export interface IHeaderProps {
    headerText: string;
    sceneName: string;
    drawerNavigation: DrawerNavigationProp<any>;
    stackNavigation: StackNavigationProp<any>;
    showBackButton?: boolean;
    subheaderText?: string;
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
        RealtimeDatabaseApi.addProductsChangedListener(this.removeUnavailableProductsInCart);
        return this.removeUnavailableProductsInCart().then(DatabaseApi.getCart).then(this.updateCart);
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

    removeUnavailableProductsInCart() {
        return DatabaseApi.removeUnavailableProductsFromCart()
            .then((unavailableProducts) => {
                // TODO show modal window with now unavailable products
                return;
            })
            .then(DatabaseApi.getCart)
            .then(this.updateCart);
    }

    render() {
        let actionIcon = <View />;

        switch (this.props.sceneName) {
            case "CartScreen":
                actionIcon = (
                    <View style={stylesheet.topContainer} onTouchEnd={this.clearCart}>
                        <TrashIcon width={TRASH_ICON_SIZE} height={TRASH_ICON_SIZE} fill={globalColors.primaryColor} />
                    </View>
                );
                break;
            default:
                if (this.state.cart.totalPrice > 0) {
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
                }
        }

        return (
            <>
                <View style={stylesheet.container}>
                    <View style={stylesheet.topContainer}>
                        <MenuIcon
                            width={MENU_ICON_SIZE}
                            height={MENU_ICON_SIZE}
                            onTouchEnd={() => this.props.drawerNavigation.openDrawer()}
                        />
                        <Text style={stylesheet.title}>{this.props.headerText}</Text>
                    </View>
                    <View style={stylesheet.topContainer}>{actionIcon}</View>
                </View>
                {this.props.showBackButton !== false ? (
                    <View style={stylesheet.subheaderContainer}>
                        <FishIcon
                            style={{flex: 1}}
                            width={FISH_ICON_SIZE.width}
                            height={FISH_ICON_SIZE.height}
                            onTouchEnd={() => this.props.stackNavigation.goBack()}
                        />
                        {this.props.subheaderText ? (
                            <>
                                <Text style={stylesheet.subTitle}>{this.props.subheaderText}</Text>
                                <View style={{flex: 1}} />
                            </>
                        ) : null}
                    </View>
                ) : null}
            </>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "100%",
        height: 70,
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: globalColors.transparent,
    },
    subheaderContainer: {
        width: "100%",
        paddingHorizontal: 12,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontFamily: "Montserrat-Black",
        fontStyle: "normal",
        fontSize: 24,
        lineHeight: 29,
        color: globalColors.primaryColor,
        marginLeft: 9,
    },
    subTitle: {
        flex: 5,
        textAlignVertical: "center",
        textAlign: "center",
        height: "100%",
        fontFamily: "Mulish-Bold",
        fontSize: 18,
        color: globalColors.primaryColor,
        marginRight: 7,
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    priceText: {
        fontFamily: "Muli-Bold",
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
