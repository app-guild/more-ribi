import React, {Component} from "react";
import Order from "../entities/Order";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Overlay} from "react-native-elements";
import {ProductType} from "../entities/ProductType";
import WokProduct from "../entities/WokProduct";
import DatabaseApi from "../utils/database/DatabaseApi";
import {globalColors} from "../../resources/styles";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Product from "../entities/Product";
import Divider from "./Divider";

interface ICheckModalState {
    modalVisible: boolean;
    order: Order | null;
}

interface IRowProps {
    name: string;
    price: number;
    count: number;
}

function Row(props: IRowProps) {
    return (
        <View style={stylesheet.rowContainer}>
            <Text style={{flex: 5}}>{props.name}</Text>
            <Text style={{flex: 2, textAlign: "center"}}>{props.price + " ₽"}</Text>
            <Text style={{flex: 1, textAlign: "center"}}>{props.count}</Text>
            <Text style={{flex: 2, textAlign: "right"}}>{props.price * props.count + " ₽"}</Text>
        </View>
    );
}

function Header() {
    return (
        <View style={stylesheet.rowContainer}>
            <Text style={{flex: 5, fontWeight: "bold"}}>Название</Text>
            <Text style={{flex: 2, fontWeight: "bold", textAlign: "center"}}>Цена</Text>
            <Text style={{flex: 1, fontWeight: "bold", textAlign: "center"}}>Кол.</Text>
            <Text style={{flex: 2, textAlign: "right", fontWeight: "bold"}}>Сумма</Text>
        </View>
    );
}

export default class OrderCheckModal extends Component<Readonly<any>, Readonly<ICheckModalState>> {
    constructor(props: any) {
        super(props);

        this.state = {
            modalVisible: false,
            order: null,
        };
    }

    repeatOrder = (): Promise<void> => {
        if (this.state.order) {
            const order = this.state.order;
            return DatabaseApi.getCart()
                .then((cart) => {
                    return RealtimeDatabaseApi.getProducts().then((products: Map<ProductType, Product[]>) => {
                        cart.clear();
                        [...order.products.keys()].forEach((productFromOrder) => {
                            if (productFromOrder.type === ProductType.CustomPoke) {
                                cart.addProduct(productFromOrder, order.products.get(productFromOrder));
                            } else {
                                let updatedProduct;
                                if (products.has(productFromOrder.type)) {
                                    products.get(productFromOrder.type)?.forEach((it) => {
                                        if (productFromOrder.type === ProductType.Wok) {
                                            const wokFromOrder = productFromOrder as WokProduct;
                                            const wokFromRealtimeDatabase = it as WokProduct;
                                            if (wokFromOrder.name === wokFromRealtimeDatabase.name) {
                                                updatedProduct = new WokProduct(
                                                    it.name,
                                                    ProductType.Wok,
                                                    it.price,
                                                    it.discountPrice,
                                                    it.available,
                                                    it.image,
                                                    it.composition,
                                                    wokFromOrder.base,
                                                    wokFromOrder.sauce,
                                                );
                                            }
                                        } else {
                                            if (it.id === productFromOrder.id) {
                                                updatedProduct = it;
                                            }
                                        }
                                    });
                                }
                                if (updatedProduct) {
                                    cart.addProduct(updatedProduct, order.products.get(productFromOrder));
                                }
                            }
                        });
                        return cart;
                    });
                })
                .then((cart) => DatabaseApi.updateProductsInCart(cart))
                .then(() => DatabaseApi.removeUnavailableProductsFromCart());
        }
        return Promise.resolve();
    };

    show(order: Order): void {
        // Сперва создаем компоненты и только после этого отображаем
        this.setState({order}, () => {
            this.setState({modalVisible: true});
        });
    }

    render() {
        if (this.state.order) {
            const rows: JSX.Element[] = [];
            this.state.order.products.forEach((count, product) => {
                let productName = product.name;
                if (product.type === ProductType.Wok && product instanceof WokProduct) {
                    productName = product.toString();
                }
                rows.push(
                    <Row
                        key={product.id}
                        name={productName}
                        price={product.discountPrice || product.price}
                        count={count}
                    />,
                );
            });
            const orderDate = this.state.order.date;

            let date = ("0" + orderDate.getDate()).slice(-2);
            let month = ("0" + (orderDate.getMonth() + 1)).slice(-2);
            let year = orderDate.getFullYear();
            let hours = ("0" + orderDate.getHours()).slice(-2);
            let minutes = ("0" + orderDate.getMinutes()).slice(-2);

            return (
                <Overlay
                    overlayStyle={stylesheet.scroll}
                    isVisible={this.state.modalVisible}
                    onBackdropPress={() => this.setState({modalVisible: false})}>
                    <ScrollView style={stylesheet.scroll}>
                        <Text style={{marginBottom: 10, textAlign: "center"}}>
                            {this.state.order.address.toString()}
                        </Text>
                        <Text>{`${date}.${month}.${year} ${hours}: ${minutes}`}</Text>
                        <Text style={stylesheet.productsHeader}>Продукты</Text>

                        <Divider style={stylesheet.checkBorder} />
                        <Header />
                        {rows}
                        <Divider style={{...stylesheet.checkBorder, marginTop: 20}} />

                        <View style={stylesheet.resultContainer}>
                            <Text style={stylesheet.resultText}>ИТОГО:</Text>
                            <Text style={{...stylesheet.resultText, textAlign: "right"}}>
                                {this.state.order.totalPrice + " ₽"}
                            </Text>
                        </View>

                        <Text style={{...stylesheet.additionalText, marginTop: 30}}>
                            {"Способ оплаты: " + this.state.order.paymentMethod.toLowerCase()}
                        </Text>
                        {this.state.order.comment ? (
                            <Text style={stylesheet.additionalText}>{"Комментарий: " + this.state.order.comment}</Text>
                        ) : null}
                        <TouchableOpacity
                            activeOpacity={0.5}
                            style={stylesheet.repeatButton}
                            onPress={() => this.repeatOrder()}>
                            <Text style={stylesheet.repeatText}>Повторить заказ</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </Overlay>
            );
        } else {
            return <></>;
        }
    }
}

const stylesheet = StyleSheet.create({
    scroll: {
        alignSelf: "center",
        width: "90%",
        marginVertical: 20,
        backgroundColor: "#FFFFFF",
    },
    container: {
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    productsHeader: {
        marginTop: 15,
        marginBottom: 15,
        fontWeight: "bold",
    },
    checkBorder: {
        width: "100%",
        borderStyle: "dashed",
        borderWidth: 1,
        borderRadius: 1,
    },
    resultContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
    },
    resultText: {
        flex: 1,
        fontWeight: "bold",
        fontSize: 24,
        lineHeight: 40,
    },
    rowContainer: {
        flexDirection: "row",
        padding: 5,
    },
    additionalText: {
        alignSelf: "flex-start",
        fontSize: 13,
    },
    repeatButton: {
        zIndex: 1000,
        paddingVertical: 11,
        paddingHorizontal: 22,
        marginTop: 15,
        backgroundColor: globalColors.primaryColor,
        borderRadius: 7,
        alignSelf: "center",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    repeatText: {
        fontFamily: "Montserrat-Bold",
        fontSize: 14,
        lineHeight: 17,
        color: globalColors.whiteTextColor,
    },
});
