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
    }

    componentDidMount() {
        return DatabaseApi.getOrders().then((orders) => {
            this.setState({orders});
        });
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
