import React, {Component} from "react";
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Divider} from "react-native-paper";
import {globalColors} from "../../resources/styles";
import Moment from "react-moment";
import Order from "../entities/Order";
import OrderCheckModal from "../components/OrderCheckModal";
import DatabaseApi from "../utils/database/DatabaseApi";

interface IMyOrdersScreenState {
    orders: Order[];
}

export default class MyOrdersScreen extends Component<Readonly<any>, Readonly<IMyOrdersScreenState>> {
    private _modal = React.createRef<OrderCheckModal>();

    constructor(props: any) {
        super(props);
        this.state = {
            orders: [],
        };
        this.updateOrders = this.updateOrders.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnOrdersChangeListener(this.updateOrders);
        return DatabaseApi.getOrders().then(this.updateOrders);
    }

    componentWillUnmount(): void {
        DatabaseApi.removeOnOrdersChangeListener(this.updateOrders);
    }

    updateOrders(orders: Order[]) {
        this.setState({orders});
    }

    private _renderItem = ({item}: {item: Order}) => {
        let date = ("0" + item.date.getDate()).slice(-2);
        let month = ("0" + (item.date.getMonth() + 1)).slice(-2);
        let year = item.date.getFullYear();
        let hours = ("0" + item.date.getHours()).slice(-2);
        let minutes = ("0" + item.date.getMinutes()).slice(-2);
        return (
            <TouchableOpacity style={stylesheet.itemContainer} onPress={() => this._modal.current?.show(item)}>
                <Text style={stylesheet.addressText}>{item.address.toString()}</Text>
                <View style={stylesheet.datePriceContainer}>
                    <Text>{`${date}.${month}.${year} ${hours}: ${minutes}`}</Text>
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
                    data={this.state.orders}
                    initialNumToRender={15}
                    maxToRenderPerBatch={10}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={() => <Divider style={stylesheet.divider} />}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={() =>
                        this.state.orders.length ? <Divider style={stylesheet.divider} /> : null
                    }
                    ListFooterComponent={() =>
                        this.state.orders.length ? <Divider style={stylesheet.divider} /> : null
                    }
                    ListEmptyComponent={() => (
                        <Text style={{alignSelf: "center"}}>Вы еще не сделали ни одного заказа!</Text>
                    )}
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
