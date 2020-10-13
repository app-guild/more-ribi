import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {Divider} from "react-native-paper";

export interface IDeliveryConditionsScreenState {}

export default class DeliveryConditionsScreen extends Component<
    Readonly<any>,
    Readonly<IDeliveryConditionsScreenState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <Divider style={stylesheet.divider} />
                <Text style={stylesheet.indent}>Бесплатная доставка еды по Ярославлю при заказе от 500 Р</Text>

                <Text style={stylesheet.bold}>Время работы:</Text>
                <Text>
                    Ярославль, Некрасова 52/35: <Text style={stylesheet.underline}>09:00-00:00</Text>
                </Text>
                <Text>
                    Ярославль, Свободы 52: <Text style={stylesheet.underline}>09:00-00:00</Text>
                </Text>
                <Text style={stylesheet.indent}>
                    Ярославль, Комсомольская 12: <Text style={stylesheet.underline}>11:00-00:00</Text>
                </Text>

                <Text style={{...stylesheet.indent, ...stylesheet.bold}}>Заказы принимаются с 09:00 до 00:00</Text>

                <Text style={stylesheet.bold}>Время доставки</Text>
                <Text style={stylesheet.indent}>35-60 минут</Text>

                <Text style={stylesheet.bold}>Оплата:</Text>
                <Text>Наличными курьеру, банковской картой в приложении, картой курьеру</Text>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    divider: {
        marginTop: 5,
        marginBottom: 20,
        height: 1,
    },
    underline: {
        textDecorationLine: "underline",
    },
    bold: {
        fontWeight: "bold",
    },
    indent: {
        marginBottom: 30,
    },
});
