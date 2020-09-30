import React, {Component} from "react";
import {Picker, ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {PaymentsMethods} from "../utils/payment/PaymentsMethods";

export interface ICreateOrderScreenState {
    paymentMethod: PaymentsMethods;
}

class CreateOrderScreen extends Component<Readonly<any>, Readonly<ICreateOrderScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            paymentMethod: PaymentsMethods.CashToCourier,
        };
    }

    render() {
        return (
            <View>
                <ScrollView>
                    <View style={stylesheet.container}>
                        <View style={stylesheet.row}>
                            <TextInput style={stylesheet.rowText} placeholder={"Имя"} />
                        </View>
                        <View style={stylesheet.row}>
                            <TextInput style={stylesheet.rowText} keyboardType="phone-pad" placeholder={"Телефон"} />
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
                            <Picker />
                        </View>
                    </View>
                </ScrollView>
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
});

export default CreateOrderScreen;
