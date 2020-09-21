import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";
import MenuIcon from "../../resources/assets/drawable/menu_icon.svg";
import CartIcon from "../../resources/assets/drawable/cart_icon.svg";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import Cart from "../entities/Cart";
import DatabaseApi from "../utils/database/DatabaseApi";
import {StackNavigationProp} from "@react-navigation/stack";

const ICON_SIZE = 40;

export interface IHeaderState {
    cartPrise: number;
}
export interface IHeaderProps {
    screenTitle: string;
    drawerNavigation: DrawerNavigationProp<any>;
    stackNavigation: StackNavigationProp<any>;
}

class Header extends Component<Readonly<IHeaderProps>, Readonly<IHeaderState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            cartPrise: 0,
        };
        this.updateCartPrice = this.updateCartPrice.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.updateCartPrice);
        return DatabaseApi.getCart().then(this.updateCartPrice);
    }

    componentWillUnmount() {
        DatabaseApi.removeOnCartChangeListener(this.updateCartPrice);
    }

    updateCartPrice(cart: Cart) {
        this.setState({cartPrise: cart.totalPrice});
    }

    render() {
        let cartIcon = <View />;
        if (this.state.cartPrise > 0) {
            cartIcon = (
                <View
                    style={stylesheet.topContainer}
                    onTouchEnd={() => this.props.stackNavigation.navigate("CartScreen")}>
                    <CartIcon width={ICON_SIZE * 0.5} height={ICON_SIZE * 0.5} fill={globalColors.primaryColor} />
                    <Text numberOfLines={1} style={stylesheet.priceText}>
                        {Math.round(this.state.cartPrise)}
                    </Text>
                </View>
            );
        }

        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.topContainer}>
                    <MenuIcon
                        width={ICON_SIZE}
                        height={ICON_SIZE}
                        onTouchEnd={this.props.drawerNavigation.openDrawer}
                    />
                    <Text style={stylesheet.title}>{this.props.screenTitle}</Text>
                </View>
                <View style={stylesheet.topContainer}>{cartIcon}</View>
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
