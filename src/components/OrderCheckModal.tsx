import React, {Component} from "react";
import Order from "../entities/Order";
import {View, Text, StyleSheet, ScrollView} from "react-native";
import Modal from "react-native-modal";
import Moment from "react-moment";
import {Divider} from "react-native-paper";
import Address from "../entities/Address";

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
            <Text style={{flex: 2, textAlign: "center"}}>{props.price}</Text>
            <Text style={{flex: 1, textAlign: "center"}}>{props.count}</Text>
            <Text style={{flex: 2, textAlign: "right"}}>{props.price * props.count}</Text>
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
                rows.push(
                    <Row
                        key={product.id}
                        name={product.name}
                        price={product.discountPrice || product.price}
                        count={count}
                    />,
                );
            });

            return (
                <Modal
                    isVisible={this.state.modalVisible}
                    animationIn={"zoomInUp"}
                    animationOut={"zoomOutUp"}
                    style={{margin: 0}}
                    onBackdropPress={() => this.setState({modalVisible: false})}
                    onBackButtonPress={() => this.setState({modalVisible: false})}>
                    <ScrollView style={stylesheet.scroll} contentContainerStyle={stylesheet.container}>
                        <Text style={{marginBottom: 10, textAlign: "center"}}>
                            {Address.print(this.state.order.address)}
                        </Text>
                        <Moment format={"DD.MM.YYYY HH:MM"} element={Text}>
                            {this.state.order.date}
                        </Moment>
                        <Text style={stylesheet.productsHeader}>Продукты</Text>

                        <Divider style={stylesheet.checkBorder} />
                        <Header />
                        {rows}
                        <Divider style={{...stylesheet.checkBorder, marginTop: 20}} />

                        <View style={stylesheet.resultContainer}>
                            <Text style={stylesheet.resultText}>ИТОГО:</Text>
                            <Text style={{...stylesheet.resultText, textAlign: "right"}}>
                                {this.state.order.totalPrice}
                            </Text>
                        </View>

                        <Text style={{...stylesheet.additionalText, marginTop: 30}}>
                            {"Способ оплаты: " + this.state.order.paymentMethod.toLowerCase()}
                        </Text>
                        {this.state.order.comment ? (
                            <Text style={stylesheet.additionalText}>{"Комментарий: " + this.state.order.comment}</Text>
                        ) : null}
                    </ScrollView>
                </Modal>
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
});
