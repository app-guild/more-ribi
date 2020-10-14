import React, {Component, createRef} from "react";
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
import {IPaymentTransaction} from "../utils/payment/GooglePayService";
import {Currency} from "../utils/payment/Currency";
import RadioButtonGroup from "../components/RadioButtonGroup";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Restaurant from "../entities/Restaurant";
import ApplePayService, {IPaymentDetails} from "../utils/payment/ApplePayService";
import ApplePayButton from "react-native-apple-pay-button";
import EmailService from "../utils/email/EmailService";
import SimpleToast from "react-native-simple-toast";
import { StackActions } from "@react-navigation/native";

export interface ICreateOrderScreenState {
    isDelivery: boolean;
    restaurantForPickup?: Restaurant;
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
    deliveryOrPickupRef = createRef<RadioButtonGroup>();
    restaurants: Restaurant[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            isDelivery: true,
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
        this.sendOrder = this.sendOrder.bind(this);
        this.payWithGoogle = this.payWithGoogle.bind(this);
        this.onTakeWayChanged = this.onTakeWayChanged.bind(this);
        Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentDidMount() {
        return this.getModifiedPaymentsMethods()
            .then(async (modifiedPaymentsMethods) => {
                this.restaurants = await RealtimeDatabaseApi.getRestaurants();
                const cart = await DatabaseApi.getCart();
                let address = await KeyValueStorage.getAddress();
                const name = await KeyValueStorage.getUserName();
                const phone = await KeyValueStorage.getPhoneNumber();
                let lastPaymentMethod = await KeyValueStorage.getLastPaymentMethod();
                if (!address) {
                    address = new Address();
                }
                if (lastPaymentMethod) {
                    modifiedPaymentsMethods.paymentMethod = lastPaymentMethod;
                }
                this.setState({
                    ...modifiedPaymentsMethods,
                    restaurantForPickup: this.restaurants[0],
                    totalPrice: cart.totalPrice,
                    address,
                    name,
                    phone,
                });
            })
            .then(() => DatabaseApi.addOnCartChangeListener(this.updateTotalPrice));
    }

    componentWillUnmount(): void {
        DatabaseApi.removeOnCartChangeListener(this.updateTotalPrice);
    }

    private isButtonEnable(): boolean {
        if (this.state.isDelivery) {
            return !!(this.state.name && this.state.phone.length === 18 && this.state.address.mainAddress);
        } else {
            return !!(this.state.name && this.state.phone.length === 18 && this.state.restaurantForPickup);
        }
    }

    private async getModifiedPaymentsMethods(): Promise<{
        availablePaymentMethods: Set<PaymentsMethods>;
        paymentMethod: PaymentsMethods;
    }> {
        return new Promise(async (resolve) => {
            if (Platform.OS === "ios") {
                let availablePaymentMethods = new Set([
                    ...this.state.availablePaymentMethods,
                    PaymentsMethods.ApplePay,
                ]);
                let paymentMethod = PaymentsMethods.ApplePay;

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

    private updateTotalPrice(cart: Cart) {
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

    private renderRestaurantsPickerItems() {
        return this.restaurants.map((rest) => {
            const label = rest.address.split(";").slice(1).join(" ");
            return <Picker.Item label={label} value={rest} key={rest.address} />;
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
            .then((success: boolean) => {
                if (success) {
                    return this.sendOrder();
                }
                return;
            });
    }

    private async payWithApple() {
        const transaction: IPaymentDetails = {
            total: {
                label: "Заказ из Много Рыбы",
                amount: {
                    currency: Currency.RUB,
                    value: this.state.totalPrice.toString(),
                },
            },
        };
        const paymentRequest = global.applePayService.getPaymentRequest(transaction);
        return ApplePayService.processPayment(paymentRequest, (paymentDetails) => console.log(paymentDetails)).then(
            this.sendOrder,
        );
    }

    private async sendOrder() {
        return KeyValueStorage.setAddress(this.state.address)
            .then(() => KeyValueStorage.setPhoneNumber(this.state.phone))
            .then(() => KeyValueStorage.setUserName(this.state.name))
            .then(() => KeyValueStorage.setAddress(this.state.address))
            .then(() => KeyValueStorage.setLastPaymentMethod(this.state.paymentMethod))
            .then(() => DatabaseApi.getCart())
            .then((cart) => {
                let address: Address | Restaurant = this.state.address;
                if (!this.state.isDelivery && this.state.restaurantForPickup) {
                    address = this.state.restaurantForPickup;
                }
                EmailService.sendDeliveryOrder(cart, this.state.paymentMethod, address, this.state.comment);
            })
            .catch(() => {
                SimpleToast.show(
                    "Не удалось сделать заказ. Пожалуйста, проверьте соединение с интернетом.",
                    SimpleToast.LONG,
                );
            })
            .then(() => {
                let address: Address = this.state.address;
                if (!this.state.isDelivery && this.state.restaurantForPickup) {
                    address = new Address(`Самовывоз: ${this.state.restaurantForPickup.address}`);
                }
                return DatabaseApi.createOrderFromCart(
                    JSON.stringify(address),
                    this.state.comment,
                    this.state.paymentMethod,
                ).then(() => {
                    this.props.route.params.drawerNavigation.navigate("Меню доставки");
                    this.props.navigation.dispatch(StackActions.popToTop());
                });
            });
    }

    private renderPayButton() {
        const buttonColor = this.isButtonEnable() ? globalColors.primaryColor : globalColors.fadePrimaryColor;

        const buttonSize = {
            width: Dimensions.get("window").width - PixelRatio.getPixelSizeForLayoutSize(16),
            height: PixelRatio.getPixelSizeForLayoutSize(21),
        };

        let button = null;
        if (this.state.buttonVisible) {
            switch (this.state.paymentMethod) {
                case PaymentsMethods.GooglePay: {
                    if (Platform.OS === "android" && this.isButtonEnable()) {
                        button = (
                            <TouchableOpacity
                                onPress={() => {
                                    if (this.isButtonEnable()) {
                                        return this.payWithGoogle();
                                    }
                                    return null;
                                }}>
                                <RNGooglePayButton style={{...buttonSize, ...stylesheet.orderButton}} />
                            </TouchableOpacity>
                        );
                    }
                    break;
                }
                case PaymentsMethods.ApplePay: {
                    if (Platform.OS === "ios" && this.isButtonEnable()) {
                        button = (
                            <ApplePayButton
                                buttonStyle="whiteOutline"
                                type="buy"
                                style={{...buttonSize, ...stylesheet.orderButton}}
                                onPress={() => {
                                    if (this.isButtonEnable()) {
                                        return this.payWithApple();
                                    }
                                    return null;
                                }}
                            />
                        );
                    }
                    break;
                }
                default: {
                    button = (
                        <TouchableOpacity
                            style={{...buttonSize, ...stylesheet.orderButton, backgroundColor: buttonColor}}
                            onPress={() => {
                                if (this.isButtonEnable()) {
                                    return this.sendOrder();
                                }
                                return null;
                            }}>
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

    private onTakeWayChanged(isChanged: boolean) {
        if (isChanged) {
            const deliveryOrPickup = this.deliveryOrPickupRef.current;
            if (deliveryOrPickup) {
                const isDelivery = deliveryOrPickup.getCheckedNumber() === 0;
                this.setState({isDelivery});
            }
        }
    }

    private renderFields() {
        return this.state.isDelivery ? (
            <View>
                <View style={stylesheet.row}>
                    <TextInput
                        style={stylesheet.rowText}
                        value={this.state.address.mainAddress}
                        onChangeText={(address: string) => {
                            this.state.address.mainAddress = address;
                            this.setState({address: this.state.address});
                        }}
                        placeholder={"Адрес"}
                    />
                </View>
                <View style={stylesheet.row}>
                    <TextInput
                        style={stylesheet.rowText}
                        value={this.state.address.entrance}
                        onChangeText={(entrance: string) => {
                            this.state.address.entrance = entrance;
                            this.setState({address: this.state.address});
                        }}
                        placeholder={"Подъезд"}
                    />
                    <TextInput
                        style={stylesheet.rowText}
                        value={this.state.address.floor}
                        onChangeText={(floor: string) => {
                            this.state.address.floor = floor;
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
            </View>
        ) : (
            <View>
                <View style={stylesheet.row}>
                    <View style={stylesheet.rowText}>
                        <Picker
                            selectedValue={this.state.restaurantForPickup}
                            onValueChange={(itemValue) => this.setState({restaurantForPickup: itemValue})}
                            style={stylesheet.rowText}>
                            {this.renderRestaurantsPickerItems()}
                        </Picker>
                    </View>
                </View>
            </View>
        );
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
                                onChangeText={(phone: string) => this.setState({phone})}
                                keyboardType="phone-pad"
                                placeholder={"Телефон"}
                                mask={"+7 ([000]) [000] [00] [00]"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <Text style={stylesheet.rowHeader}>Доставка</Text>
                        </View>
                        <View style={stylesheet.row}>
                            <RadioButtonGroup
                                ref={this.deliveryOrPickupRef}
                                onClick={this.onTakeWayChanged}
                                choices={[{name: "Доставить по адресу"}, {name: "Самовывоз"}]}
                                labelStyle={globalStylesheet.headerText}
                            />
                        </View>
                        {this.renderFields()}
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
        paddingVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 5,
        marginHorizontal: PixelRatio.getPixelSizeForLayoutSize(8),
        marginBottom: PixelRatio.getPixelSizeForLayoutSize(8),
    },
    orderButtonText: {
        ...globalStylesheet.headerText,
        color: globalColors.mainBackgroundColor,
    },
});

export default CreateOrderScreen;
