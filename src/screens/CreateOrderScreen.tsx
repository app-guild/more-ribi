import React, {Component, createRef} from "react";
import {Dimensions, Keyboard, PixelRatio, StyleSheet, Text, TextInput, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {PaymentsMethods} from "../utils/payment/PaymentsMethods";
import {TouchableOpacity} from "react-native-gesture-handler";
import Cart from "../entities/Cart";
import DatabaseApi from "../utils/database/DatabaseApi";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import Address from "../entities/Address";
import KeyValueStorage from "../utils/KeyValueStorage";
import TextInputMask from "react-native-text-input-mask";
import RadioButtonGroup from "../components/RadioButtonGroup";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Restaurant from "../entities/Restaurant";
import EmailService, {NETWORK_ERROR} from "../utils/email/EmailService";
import {StackActions} from "@react-navigation/native";
import InfoModal from "../components/InfoModal";
import AdaptPicker from "../components/AdaptPicker";
import RNTinkoffAsdk from "react-native-tinkoff-asdk";

export interface ICreateOrderScreenState {
    isDelivery: boolean;
    restaurantForPickup?: Restaurant;
    availablePaymentMethods: Set<PaymentsMethods>;
    paymentMethod: PaymentsMethods;
    buttonVisible: boolean;
    cart: Cart | null;
    address: Address;
    name: string;
    phone: string;
    comment: string;
}

class CreateOrderScreen extends Component<Readonly<any>, Readonly<ICreateOrderScreenState>> {
    deliveryOrPickupRef = createRef<RadioButtonGroup>();
    private infoModal = createRef<InfoModal>();
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
            cart: null,
            availablePaymentMethods: new Set([
                PaymentsMethods.CardToCourier,
                PaymentsMethods.CashToCourier,
                PaymentsMethods.InternetAcquiring,
            ]),
            paymentMethod: PaymentsMethods.CardToCourier,
        };
        this.updateCart = this.updateCart.bind(this);
        this.sendOrder = this.sendOrder.bind(this);
        this.payWithTinkoff = this.payWithTinkoff.bind(this);
        this.onTakeWayChanged = this.onTakeWayChanged.bind(this);
        Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentDidMount() {
        return new Promise(async () => {
            this.restaurants = await RealtimeDatabaseApi.getRestaurants();
            const cart = await DatabaseApi.getCart();
            let address = await KeyValueStorage.getAddress();
            const name = await KeyValueStorage.getUserName();
            const phone = await KeyValueStorage.getPhoneNumber();
            let lastPaymentMethod = await KeyValueStorage.getLastPaymentMethod();
            if (!address) {
                address = new Address();
            }
            const paymentMethod = lastPaymentMethod ? lastPaymentMethod : PaymentsMethods.CardToCourier;
            this.setState({
                paymentMethod,
                restaurantForPickup: this.restaurants[0],
                address,
                cart,
                name,
                phone,
            });
            DatabaseApi.addOnCartChangeListener(this.updateCart);
        });
    }

    componentWillUnmount(): void {
        DatabaseApi.removeOnCartChangeListener(this.updateCart);
    }

    private isButtonEnable(): boolean {
        if (this.state.isDelivery) {
            return !!(this.state.name && this.state.phone.length === 18 && this.state.address.mainAddress);
        } else {
            return !!(this.state.name && this.state.phone.length === 18 && this.state.restaurantForPickup);
        }
    }

    private updateCart(cart: Cart) {
        this.setState({cart});
    }

    private _keyboardDidShow = () => {
        this.setState({buttonVisible: false});
    };

    private _keyboardDidHide = () => {
        this.setState({buttonVisible: true});
    };

    private async payWithTinkoff() {
        const getItmes = (cart: Cart): any[] => {
            const items: any[] = [];
            cart.products.forEach((product) => {
                items.push({
                    Name: product.name,
                    Price: product.price * 100,
                    Quantity: cart.getProductCount(product),
                    Amount: product.price * 100 * cart.getProductCount(product),
                    Tax: "none",
                });
            });
            console.log("Items:");
            console.log(items);
            return items;
        };

        const cart = this.state.cart;

        if (cart) {
            const payment = {
                OrderID: Date.now().toString(), // ID заказа в вашей системе //TODO настроить синхронизацию с firebase для актуальности id
                Amount: cart.totalPrice * 100, // сумма для оплаты (в копейках)
                PaymentName: "Заказ Много Рыбы", // название платежа, видимое пользователю
                PaymentDesc: "", // описание платежа, видимое пользователю
                CardID: "CARD-ID", // ID карточки
                Email: "",
                IsRecurrent: false, // флаг определяющий является ли платеж рекуррентным [1]
                UseSafeKeyboard: true, // флаг использования безопасной клавиатуры [2]
                ExtraData: {},
                GooglePayParams: {
                    MerchantName: global.googlePayCredentials.merchantId,
                    AddressRequired: false,
                    PhoneRequired: false,
                    Environment: "PRODUCTION", // "SANDBOX", "PRODUCTION"
                },
                Taxation: "usn_income",
                Items: getItmes(cart),
            };
            const hasApplePay = await RNTinkoffAsdk.isPayWithAppleAvailable();
            return new Promise(() => {
                if (hasApplePay) {
                    return RNTinkoffAsdk.ApplePay({
                        appleMerchantId: "....",
                        Phone: "+74956481000",
                        ...payment,
                    });
                } else {
                    return RNTinkoffAsdk.Pay(payment);
                }
            })
                .then((response: any) => {
                    return this.sendOrder();
                })
                .catch((e: any) => {
                    console.error(e);
                    if (this.infoModal && this.infoModal.current) {
                        this.infoModal.current.startLoadAnimation();
                        this.infoModal.current.endLoadAnimation(
                            false,
                            () => {},
                            InfoModal.FAILED_PAYMENT_PATTERN,
                            "Ошибка оплаты",
                        );
                    }
                });
        }
    }

    private async sendOrder() {
        if (this.infoModal && this.infoModal.current) {
            this.infoModal.current.startLoadAnimation();
        }
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
                return EmailService.sendDeliveryOrder(cart, this.state.paymentMethod, address, this.state.comment);
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
                    if (this.infoModal && this.infoModal.current) {
                        this.infoModal.current.endLoadAnimation(
                            true,
                            () => {
                                this.props.route.params.drawerNavigation.navigate("Меню доставки");
                                this.props.navigation.dispatch(StackActions.popToTop());
                            },
                            InfoModal.SUCCESSFUL_SEND_ORDER_PATTERN,
                        );
                    }
                });
            })
            .catch((e) => {
                console.error("Order error:");
                console.error(e);
                if (this.infoModal && this.infoModal.current) {
                    if (e === NETWORK_ERROR) {
                        this.infoModal.current.endLoadAnimation(false, () => {}, InfoModal.FAILED_SEND_ORDER_PATTERN);
                    } else {
                        // TODO Print error and ask for connect as.
                        this.infoModal.current.endLoadAnimation(false, () => {}, InfoModal.FAILED_SEND_ORDER_PATTERN);
                    }
                }
            });
    }

    private renderPayButton() {
        const buttonColor = this.isButtonEnable() ? globalColors.primaryColor : globalColors.fadePrimaryColor;

        const buttonSize = {
            minWidth: Dimensions.get("window").width - PixelRatio.getPixelSizeForLayoutSize(16),
            minHeight: 50,
        };

        if (this.state.buttonVisible) {
            return (
                <View>
                    <View style={stylesheet.totalPriceContainer}>
                        <Text style={stylesheet.totalPriceText}>Сумма заказа: </Text>
                        <Text style={stylesheet.totalPriceText}>{this.state.cart?.totalPrice + " ₽"}</Text>
                    </View>
                    <TouchableOpacity
                        style={{...buttonSize, ...stylesheet.orderButton, backgroundColor: buttonColor}}
                        onPress={() => {
                            if (this.isButtonEnable()) {
                                // return this.sendOrder();
                                if (this.state.paymentMethod === PaymentsMethods.InternetAcquiring) {
                                    return this.payWithTinkoff();
                                } else {
                                    return this.sendOrder();
                                }
                            }
                            return null;
                        }}>
                        <Text style={stylesheet.orderButtonText}>ЗАКАЗАТЬ</Text>
                    </TouchableOpacity>
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
                        <AdaptPicker
                            items={this.restaurants.map((it) => it.address.split(";")[1])}
                            onValueChange={(itemValue) =>
                                this.setState({
                                    restaurantForPickup: this.restaurants.find(
                                        (it) => it.address.split(";")[1] === itemValue,
                                    ),
                                })
                            }
                        />
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
                            <Text style={stylesheet.rowHeader}>Способ оплаты</Text>
                        </View>
                        <View style={stylesheet.row}>
                            <View style={stylesheet.rowText}>
                                <AdaptPicker
                                    initValue={this.state.paymentMethod}
                                    items={[...this.state.availablePaymentMethods]}
                                    onValueChange={(itemValue) => {
                                        const method = PaymentsMethods.parse(itemValue);
                                        this.setState({paymentMethod: method ? method : PaymentsMethods.CashToCourier});
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.renderPayButton()}
                <InfoModal ref={this.infoModal} />
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
        padding: 12,
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
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 5,
        marginHorizontal: PixelRatio.getPixelSizeForLayoutSize(8),
        marginBottom: PixelRatio.getPixelSizeForLayoutSize(8),
    },
    orderButtonText: {
        ...globalStylesheet.headerText,
        color: "white",
    },
});

export default CreateOrderScreen;
