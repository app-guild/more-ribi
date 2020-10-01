import React, {Component} from "react";
import {Keyboard, Picker, Platform, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {PaymentsMethods} from "../utils/payment/PaymentsMethods";
import {TouchableOpacity} from "react-native-gesture-handler";
import Cart from "../entities/Cart";
import DatabaseApi from "../utils/database/DatabaseApi";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Address from "../entities/Address";
import KeyValueStorage from "../utils/KeyValueStorage";

export interface ICreateOrderScreenState {
    availablePaymentMethods: Set<PaymentsMethods>;
    paymentMethod: PaymentsMethods;
    totalPrice: number;
    buttonVisible: boolean;
    address: Address | null;
    name: string;
    phone: string;
}

class CreateOrderScreen extends Component<Readonly<any>, Readonly<ICreateOrderScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: "",
            phone: "",
            address: null,
            buttonVisible: true,
            totalPrice: 0,
            availablePaymentMethods: new Set([PaymentsMethods.CardToCourier, PaymentsMethods.CashToCourier]),
            paymentMethod: PaymentsMethods.CardToCourier,
        };
        this.updateTotalPrice = this.updateTotalPrice.bind(this);
        Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentDidMount() {
        return new Promise(async (resolve) => {
            if (Platform.OS === "ios") {
                // Todo добавить проверку для Apple Pay
            } else {
                global.googlePayService.isReadyToPay().then((isReady: boolean) => {
                    if (isReady) {
                        this.setState({
                            availablePaymentMethods: new Set([
                                ...this.state.availablePaymentMethods,
                                PaymentsMethods.GooglePay,
                            ]),
                            paymentMethod: PaymentsMethods.GooglePay,
                        });
                    }
                    resolve();
                });
            }
        })
            .then(async () => {
                const cart = await DatabaseApi.getCart();
                const address = await KeyValueStorage.getAddress();
                const name = await KeyValueStorage.getUserName();
                const phone = await KeyValueStorage.getPhoneNumber();
                this.setState({totalPrice: cart.totalPrice, address, name, phone});
            })
            .then(() => DatabaseApi.addOnCartChangeListener(this.updateTotalPrice));
    }

    updateTotalPrice(cart: Cart) {
        this.setState({totalPrice: cart.totalPrice});
    }

    private _keyboardDidShow = () => {
        this.setState({buttonVisible: false});
    };

    private _keyboardDidHide = () => {
        this.setState({buttonVisible: true});
    };

    private renderPaymentsPickerItems() {
        console.log(this.state.availablePaymentMethods);
        return [...this.state.availablePaymentMethods].map((method: PaymentsMethods) => {
            console.log(method);
            return <Picker.Item label={method.toString()} value={method} key={method} />;
        });
    }

    render() {
        return (
            <KeyboardAwareScrollView>
                <View style={{flex: 1, justifyContent: "space-between"}}>
                    <ScrollView>
                        <View style={stylesheet.container}>
                            <View style={stylesheet.row}>
                                <TextInput style={stylesheet.rowText} placeholder={"Имя"} />
                            </View>
                            <View style={stylesheet.row}>
                                <TextInput
                                    style={stylesheet.rowText}
                                    keyboardType="phone-pad"
                                    placeholder={"Телефон"}
                                />
                            </View>
                            <View style={stylesheet.row}>
                                <Text style={stylesheet.rowHeader}>Доставка</Text>
                            </View>
                            <View style={stylesheet.row}>
                                <TextInput style={stylesheet.rowText} placeholder={"Улица"} />
                            </View>
                            <View style={stylesheet.row}>
                                <TextInput style={stylesheet.rowText} placeholder={"Дом"} />
                                <TextInput style={stylesheet.rowText} placeholder={"Подъезд"} />
                            </View>
                            <View style={stylesheet.row}>
                                <TextInput style={stylesheet.rowText} placeholder={"Этаж"} />
                                <TextInput style={stylesheet.rowText} placeholder={"Квартира/офис"} />
                            </View>
                            <View style={stylesheet.row}>
                                <TextInput
                                    style={{...stylesheet.rowText, ...stylesheet.rowTextMultiline}}
                                    multiline
                                    placeholder={"Комментарий к заказу"}
                                />
                            </View>
                            <View style={stylesheet.row}>
                                <View style={stylesheet.rowText}>
                                    <Picker
                                        selectedValue={this.state.paymentMethod}
                                        style={stylesheet.rowHeader}
                                        onValueChange={(itemValue) => this.setState({paymentMethod: itemValue})}>
                                        {this.renderPaymentsPickerItems()}
                                    </Picker>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {this.state.buttonVisible ? (
                        <View>
                            <View style={stylesheet.totalPriceContainer}>
                                <Text style={stylesheet.totalPriceText}>Сумма заказа: </Text>
                                <Text style={stylesheet.totalPriceText}>{this.state.totalPrice + " ₽"}</Text>
                            </View>
                            <TouchableOpacity
                                style={stylesheet.orderButton}
                                onPress={() => this.props.navigation.navigate("CreateOrderScreen")}>
                                <Text style={stylesheet.orderButtonText}>ЗАКАЗАТЬ</Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </KeyboardAwareScrollView>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        padding: 14,
    },
    row: {
        marginVertical: 10,
        flex: 1,
        flexDirection: "row",
    },
    rowHeader: {
        ...globalStylesheet.headerText,
        paddingHorizontal: 12,
        flex: 1,
        flexDirection: "row",
    },
    rowText: {
        ...globalStylesheet.primaryText,
        paddingHorizontal: 12,
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 14,
        borderColor: globalColors.fadePrimaryColor,
        borderWidth: 1,
    },
    rowTextMultiline: {
        minHeight: 120,
        maxHeight: 300,
        textAlignVertical: "top",
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

export default CreateOrderScreen;
