import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, TextInput, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";

export interface ICreateOrderScreenState {}

const FISH_ICON_BACK_SIZE = {width: 47, height: 17};

class CreateOrderScreen extends Component<Readonly<any>, Readonly<ICreateOrderScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View>
                <View style={globalStylesheet.headerContainer}>
                    <View style={globalStylesheet.header}>
                        <FishIcon
                            width={FISH_ICON_BACK_SIZE.width}
                            height={FISH_ICON_BACK_SIZE.height}
                            style={globalStylesheet.headerFishBackButton}
                            onTouchEnd={() => this.props.navigation.goBack()}
                        />
                        <Text style={globalStylesheet.headerText}>Оформляем заказ</Text>
                    </View>
                </View>
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
                            <TextInput style={stylesheet.rowText} multiline placeholder={"Комментарий к заказу"} />
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
});

export default CreateOrderScreen;
