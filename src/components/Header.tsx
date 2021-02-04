import React, {Component} from "react";
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalColors} from "../../resources/styles";
import MenuIcon from "../../resources/assets/drawable/menu_icon.svg";
import CartIcon from "../../resources/assets/drawable/cart_icon.svg";
import TrashIcon from "../../resources/assets/drawable/delete_icon.svg";
import {DrawerNavigationProp} from "@react-navigation/drawer";
import Cart from "../entities/Cart";
import DatabaseApi from "../utils/database/DatabaseApi";
import {StackNavigationProp} from "@react-navigation/stack";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";
import RNTinkoffAsdk from "react-native-tinkoff-asdk";

const MENU_ICON_SIZE = 40;
const CART_ICON_SIZE = 20;
const FISH_ICON_SIZE = {width: 47, height: 17};
const TRASH_ICON_SIZE = 30;

export interface IHeaderState {
    totalPrice: number;
}
export interface IHeaderProps {
    headerText: string;
    sceneName?: string;
    drawerNavigation: DrawerNavigationProp<any>;
    stackNavigation?: StackNavigationProp<any>;
    showBackButton?: boolean;
    subheaderText?: string;
}

class Header extends Component<Readonly<IHeaderProps>, Readonly<IHeaderState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            totalPrice: 0,
        };
        this.updateCart = this.updateCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.updateCart);
    }

    componentWillUnmount() {
        DatabaseApi.removeOnCartChangeListener(this.updateCart);
    }

    clearCart() {
        return DatabaseApi.clearCart();
    }

    updateCart(cart: Cart) {
        this.setState({totalPrice: cart.totalPrice});
    }

    render() {
        let actionIcon = <View />;

        switch (this.props.sceneName) {
            case "CartScreen":
                actionIcon = (
                    <TouchableOpacity style={stylesheet.topContainer} onPress={() => this.clearCart()}>
                        <TrashIcon width={TRASH_ICON_SIZE} height={TRASH_ICON_SIZE} fill={globalColors.primaryColor} />
                    </TouchableOpacity>
                );
                break;
            default:
                if (this.state.totalPrice > 0) {
                    actionIcon = (
                        <TouchableOpacity
                            style={stylesheet.topContainer}
                            onPress={() => {
                                const payment = RNTinkoffAsdk.Pay({
                                    OrderID: "1", // ID заказа в вашей системе
                                    Amount: 32345, // сумма для оплаты (в копейках)
                                    PaymentName: "НАЗВАНИЕ ПЛАТЕЖА", // название платежа, видимое пользователю
                                    PaymentDesc: "ОПИСАНИЕ ПЛАТЕЖА", // описание платежа, видимое пользователю
                                    CardID: "CARD-ID", // ID карточки
                                    //Email: "batman@gotham.co",         // E-mail клиента для отправки уведомления об оплате
                                    //CustomerKey: null,                 // ID клиента для сохранения карты
                                    // тестовые:
                                    Email: "testCustomerKey1@gmail.com",
                                    CustomerKey: "testCustomerKey1@gmail.com",
                                    IsRecurrent: false, // флаг определяющий является ли платеж рекуррентным [1]
                                    UseSafeKeyboard: true, // флаг использования безопасной клавиатуры [2]
                                    ExtraData: {},
                                    GooglePayParams: {
                                        MerchantName: "test",
                                        AddressRequired: false,
                                        PhoneRequired: false,
                                        Environment: "TEST", // "SANDBOX", "PRODUCTION"
                                    },
                                    Taxation: "usn_income",
                                    Items: [
                                        {
                                            Name: "test 1",
                                            Price: 10000, // В копейках (100 рублей)
                                            Quantity: 2,
                                            Amount: 20000, // В копейках (200 рублей)
                                            Tax: "none",
                                        },
                                        {
                                            Name: "test 2",
                                            Price: 12345,
                                            Quantity: 1,
                                            Amount: 12345,
                                            Tax: "none",
                                        },
                                    ],
                                });

                                payment
                                    .then((r) => {
                                        console.log(r);
                                    })
                                    .catch((e) => {
                                        console.error(e);
                                    });
                                // this.props.drawerNavigation.navigate("CartScreen");
                            }}>
                            <CartIcon width={CART_ICON_SIZE} height={CART_ICON_SIZE} fill={globalColors.primaryColor} />
                            <Text numberOfLines={1} style={stylesheet.priceText}>
                                {Math.round(this.state.totalPrice)}
                            </Text>
                        </TouchableOpacity>
                    );
                }
        }

        return (
            <SafeAreaView>
                <View style={stylesheet.container}>
                    <TouchableOpacity
                        style={stylesheet.topContainer}
                        onPress={() => this.props.drawerNavigation.openDrawer()}>
                        <MenuIcon width={MENU_ICON_SIZE} height={MENU_ICON_SIZE} />
                        <Text style={stylesheet.title}>{this.props.headerText}</Text>
                    </TouchableOpacity>
                    <View style={stylesheet.topContainer}>{actionIcon}</View>
                </View>
                {this.props.showBackButton || this.props.subheaderText ? (
                    <View style={stylesheet.subheaderContainer}>
                        {this.props.showBackButton ? (
                            <TouchableOpacity onPress={() => this.props.stackNavigation?.goBack()}>
                                <FishIcon
                                    style={{flex: 1}}
                                    width={FISH_ICON_SIZE.width}
                                    height={FISH_ICON_SIZE.height}
                                />
                            </TouchableOpacity>
                        ) : null}
                        {this.props.subheaderText ? (
                            <Text style={stylesheet.subTitle}>{this.props.subheaderText}</Text>
                        ) : null}
                        {this.props.showBackButton ? <View style={{flex: 1}} /> : null}
                    </View>
                ) : null}
            </SafeAreaView>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        width: "100%",
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
        fontFamily: "Montserrat-Black",
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
