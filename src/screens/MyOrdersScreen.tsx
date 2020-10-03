import React, {Component} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Divider} from "react-native-paper";
import {globalColors} from "../../resources/styles";
import Moment from "react-moment";
import Order from "../entities/Order";
import Product from "../entities/Product";
import {ProductType} from "../entities/ProductType";
import OrderCheckModal from "../components/OrderCheckModal";

interface IMyOrdersScreenState {}

export default class MyOrdersScreen extends Component<Readonly<any>, Readonly<IMyOrdersScreenState>> {
    private _modal = React.createRef<OrderCheckModal>();

    private data = [
        new Order(
            0,
            new Map([
                [new Product("Вок с курицей Вок с курицей Вок с курицей ", ProductType.Wok, 300, undefined, true, "", ""), 1],
                [new Product("Вок с говядиной", ProductType.Wok, 250, undefined, true, "", ""), 2],
                [new Product("Вок с курицей Вок с курицей Вок с курицей ", ProductType.Wok, 300, undefined, true, "", ""), 3],
                [new Product("Вок с говядиной", ProductType.Wok, 250, undefined, true, "", ""), 2],
                [new Product("Вок с курицей Вок с курицей Вок с курицей ", ProductType.Wok, 300, undefined, true, "", ""), 1],
                [new Product("Вок с говядиной", ProductType.Wok, 250, 200, true, "", ""), 5],
                [new Product("Вок с говядиной", ProductType.Wok, 250, undefined, true, "", ""), 2],
            ]),
            new Date(Date.now()),
            "Ярославль, ул.Свободы 52, кв. 30",
            "Хачю кушать, дайте быстрее пожрать",
            "Картой курьеру",
        ),
        new Order(
            0,
            new Map([
                [new Product("Вок с курицей", ProductType.Wok, 300, undefined, true, "", ""), 1],
                [new Product("Вок с говядиной", ProductType.Wok, 250, undefined, true, "", ""), 2],
            ]),
            new Date(Date.now()),
            "Ярославль, ул.Свободы 52, кв. 30",
            "Хачю кушать, дайте быстрее пожрать",
            "Картой на сайте",
        ),
        new Order(
            0,
            new Map([
                [new Product("Вок с курицей", ProductType.Wok, 300, undefined, true, "", ""), 1],
                [new Product("Вок с говядиной", ProductType.Wok, 250, undefined, true, "", ""), 2],
            ]),
            new Date(Date.now()),
            "Ярославль, ул.Свободы 52, кв. 30",
            "Хачю кушать, дайте быстрее пожрать",
            "Наличными",
        ),
    ];

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    private _renderItem = ({item}: {item: Order}) => {
        return (
            <TouchableOpacity style={stylesheet.itemContainer} onPress={() => this._modal.current?.show(item)}>
                <Text style={stylesheet.addressText}>{item.address}</Text>
                <View style={stylesheet.datePriceContainer}>
                    <Moment format={"D MMMM YYYY HH:MM"} element={Text}>
                        {Date.now()}
                    </Moment>
                    <Text>{item.totalPrice + "₽"}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        return (
            <>
                <FlatList
                    contentContainerStyle={stylesheet.container}
                    data={this.data}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={() => <Divider style={stylesheet.divider} />}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={() => <Divider style={stylesheet.divider} />}
                    ListFooterComponent={() => <Divider style={stylesheet.divider} />}
                />

                <OrderCheckModal ref={this._modal} />
            </>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    divider: {
        height: 1,
        backgroundColor: globalColors.additionalTextColor,
    },
    itemContainer: {
        paddingHorizontal: 10,
    },
    addressText: {
        fontSize: 16,
        fontWeight: "bold",
        lineHeight: 40,
    },
    datePriceContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10,
    },
});
