import React, {Component} from "react";
import {Dimensions, Keyboard, Picker, PixelRatio, Platform, StyleSheet, Text, TextInput, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {PaymentsMethods} from "../utils/payment/PaymentsMethods";
import {TouchableOpacity} from "react-native-gesture-handler";
import Cart from "../entities/Cart";
import DatabaseApi from "../utils/database/DatabaseApi";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Address from "../entities/Address";
import KeyValueStorage from "../utils/KeyValueStorage";
import TextInputMask from "react-native-text-input-mask";
import RNGooglePayButton from "react-native-gpay-button";
import EmailService from "../utils/email/EmailService";
import {IPaymentTransaction} from "../utils/payment/GooglePayService";
import {Currency} from "../utils/payment/Currency";
import Toast from "react-native-simple-toast";

export interface ICreateOrderScreenState {
    availablePaymentMethods: Set<PaymentsMethods>;
    paymentMethod: PaymentsMethods;
    totalPrice: number;
    buttonVisible: boolean;
    address: Address;
    name: string;
    phone: string;
    comment: string;
}

class CreateOrderScreen extends Component<Readonly<any>, Readonly<ICreateOrderScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            comment: "",
            name: "",
            phone: "",
            address: new Address(),
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
        return this.getModifiedPaymentsMethods()
            .then(async (modifiedPaymentsMethods) => {
                const cart = await DatabaseApi.getCart();
                let address = await KeyValueStorage.getAddress();
                const name = await KeyValueStorage.getUserName();
                const phone = await KeyValueStorage.getPhoneNumber();
                if (!address) {
                    address = new Address();
                }
                this.setState({...modifiedPaymentsMethods, totalPrice: cart.totalPrice, address, name, phone});
            })
            .then(() => DatabaseApi.addOnCartChangeListener(this.updateTotalPrice));
    }

    private async getModifiedPaymentsMethods(): Promise<{
        availablePaymentMethods: Set<PaymentsMethods>;
        paymentMethod: PaymentsMethods;
    }> {
        return new Promise(async (resolve) => {
            if (Platform.OS === "ios") {
                // Todo добавить проверку для Apple Pay
                let availablePaymentMethods = this.state.availablePaymentMethods;
                let paymentMethod = this.state.paymentMethod;

                resolve({availablePaymentMethods, paymentMethod});
            } else {
                global.googlePayService.isReadyToPay().then((isReady: boolean) => {
                    let availablePaymentMethods = this.state.availablePaymentMethods;
                    let paymentMethod = this.state.paymentMethod;
                    if (isReady) {
                        availablePaymentMethods = new Set([
                            ...this.state.availablePaymentMethods,
                            PaymentsMethods.GooglePay,
                        ]);
                        paymentMethod = PaymentsMethods.GooglePay;
                    }
                    resolve({availablePaymentMethods, paymentMethod});
                });
            }
        });
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
        return [...this.state.availablePaymentMethods].map((method: PaymentsMethods) => {
            return <Picker.Item label={method.toString()} value={method} key={method} />;
        });
    }

    private async payWithGoogle() {
        const transaction: IPaymentTransaction = {
            totalPrice: this.state.totalPrice.toString(),
            totalPriceStatus: "FINAL",
            currencyCode: Currency.RUB,
        };
        return global.googlePayService
            .doPaymentRequest(transaction, (token: string) => console.log(token))
            .then(this.sendOrder);
    }

    private async sendOrder() {
        return KeyValueStorage.setAddress(this.state.address)
            .then(() => KeyValueStorage.setPhoneNumber(this.state.phone))
            .then(() => KeyValueStorage.setUserName(this.state.name))
            .then(() => DatabaseApi.getCart())
            .then((cart) =>
                EmailService.sendDeliveryOrder(cart, this.state.paymentMethod, this.state.address, this.state.comment),
            )
            .then((response) => {
                if (response.data !== "Success!") {
                    Toast.show("Не удалось сделать заказ. Пожалуйста, проверьте соединение с интернетом.", Toast.LONG);
                    return null;
                }
                return DatabaseApi.createOrderFromCart(
                    JSON.stringify(this.state.address),
                    this.state.comment,
                    this.state.paymentMethod,
                );
            });
    }

    private renderPayButton() {
        const buttonColor =
            this.state.name &&
            this.state.phone.length === 18 &&
            this.state.address.street &&
            this.state.address.buildingNumber
                ? globalColors.primaryColor
                : globalColors.fadePrimaryColor;

        const buttonSize = {
            width: Dimensions.get("window").width - PixelRatio.getPixelSizeForLayoutSize(16),
            height: PixelRatio.getPixelSizeForLayoutSize(21),
        };

        let button = null;
        if (this.state.buttonVisible) {
            switch (this.state.paymentMethod) {
                case PaymentsMethods.GooglePay: {
                    button = (
                        <RNGooglePayButton
                            style={{...buttonSize, ...stylesheet.orderGoogleButton}}
                            onTouch={() => this.payWithGoogle()}
                        />
                    );
                    break;
                }
                case PaymentsMethods.ApplePay: {
                    button = null;
                    break;
                }
                default: {
                    button = (
                        <TouchableOpacity
                            style={{...stylesheet.orderButton, backgroundColor: buttonColor}}
                            onPress={() => this.sendOrder()}>
                            <Text style={stylesheet.orderButtonText}>ЗАКАЗАТЬ</Text>
                        </TouchableOpacity>
                    );
                }
            }

            return (
                <View>
                    <View style={stylesheet.totalPriceContainer}>
                        <Text style={stylesheet.totalPriceText}>Сумма заказа: </Text>
                        <Text style={stylesheet.totalPriceText}>{this.state.totalPrice + " ₽"}</Text>
                    </View>
                    {button}
                </View>
            );
        }
        return null;
    }

    render() {
        return (
            <View style={{flex: 1, justifyContent: "space-between"}}>
                <KeyboardAwareScrollView>
                    <View style={stylesheet.container}>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={stylesheet.rowText}
                                value={this.state.name}
                                onChangeText={(name) => this.setState({name})}
                                placeholder={"Имя"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <TextInputMask
                                style={stylesheet.rowText}
                                value={this.state.phone}
                                onChangeText={(phone: string) => {
                                    console.log(phone);
                                    this.setState({phone});
                                }}
                                keyboardType="phone-pad"
                                placeholder={"Телефон"}
                                mask={"+7 ([000]) [000] [00] [00]"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <Text style={stylesheet.rowHeader}>Доставка</Text>
                        </View>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={stylesheet.rowText}
                                value={this.state.address.street}
                                onChangeText={(street: string) => {
                                    this.state.address.street = street;
                                    this.setState({address: this.state.address});
                                }}
                                placeholder={"Улица"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={stylesheet.rowText}
                                value={this.state.address.buildingNumber}
                                onChangeText={(buildingNumber: string) => {
                                    this.state.address.buildingNumber = buildingNumber;
                                    this.setState({address: this.state.address});
                                }}
                                placeholder={"Дом"}
                            />
                            <TextInput
                                style={stylesheet.rowText}
                                value={this.state.address.entrance}
                                onChangeText={(entrance: string) => {
                                    this.state.address.entrance = entrance;
                                    this.setState({address: this.state.address});
                                }}
                                placeholder={"Подъезд"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={stylesheet.rowText}
                                value={this.state.address.flor}
                                onChangeText={(flor: string) => {
                                    this.state.address.flor = flor;
                                    this.setState({address: this.state.address});
                                }}
                                placeholder={"Этаж"}
                            />
                            <TextInput
                                style={stylesheet.rowText}
                                value={this.state.address.apartment}
                                onChangeText={(apartment: string) => {
                                    this.state.address.apartment = apartment;
                                    this.setState({address: this.state.address});
                                }}
                                placeholder={"Квартира/офис"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={{...stylesheet.rowText, ...stylesheet.rowTextMultiline}}
                                multiline
                                value={this.state.comment}
                                onChangeText={(comment: string) => this.setState({comment})}
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
                </KeyboardAwareScrollView>
                {this.renderPayButton()}
            </View>
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
    orderGoogleButton: {
        marginHorizontal: PixelRatio.getPixelSizeForLayoutSize(8),
        marginBottom: PixelRatio.getPixelSizeForLayoutSize(8),
    },
    orderButtonText: {
        ...globalStylesheet.primaryText,
        color: globalColors.mainBackgroundColor,
    },
});

export default CreateOrderScreen;
