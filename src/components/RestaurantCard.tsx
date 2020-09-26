import React, {Component} from "react";
import Restaurant from "../entities/Restaurant";
import {StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";

interface IRestaurantCardProps {
    restaurant: Restaurant;
}

export default class RestaurantCard extends Component<Readonly<IRestaurantCardProps>, Readonly<object>> {
    constructor(props: IRestaurantCardProps) {
        super(props);
        this.state = {};
    }

    blink() {

    }

    render() {
        const region = this.props.restaurant.address.split(";")[0];
        const address = this.props.restaurant.address.split(";")[1];
        return (
            <View style={stylesheet.container}>
                <Text style={stylesheet.address}>{address}</Text>
                <Text style={stylesheet.region}>{region}</Text>
                <Text style={stylesheet.phone}>{this.props.restaurant.phone}</Text>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
        paddingLeft: 20,
        paddingTop: 10,
    },
    address: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 22,
        lineHeight: 30,
        color: globalColors.mainTextColor,
    },
    region: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontSize: 16,
        lineHeight: 25,
        color: globalColors.mainTextColor,
    },
    phone: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontSize: 20,
        lineHeight: 40,
        color: globalColors.additionalTextColor,
    },
});
