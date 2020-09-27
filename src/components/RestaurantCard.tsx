import React, {Component} from "react";
import Restaurant from "../entities/Restaurant";
import {StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";
import * as Animatable from "react-native-animatable";
import MarkerIcon from "../../resources/assets/drawable/card_marker.svg";

interface IRestaurantCardProps {
    restaurant: Restaurant;
    onPress: () => void;
}

export default class RestaurantCard extends Component<Readonly<IRestaurantCardProps>, Readonly<object>> {
    private animation: Animatable.View | null = null;

    constructor(props: IRestaurantCardProps) {
        super(props);
        this.state = {};
    }

    blink() {
        // @ts-ignore
        this.animation?.animate({0: {opacity: 0}, 1: {opacity: 1}});
    }

    private _onTouchEnd = () => {
        this.blink();
        this.props.onPress();
    };

    render() {
        const region = this.props.restaurant.address.split(";")[0];
        const address = this.props.restaurant.address.split(";")[1];
        return (
            <Animatable.View
                ref={(ref) => (this.animation = ref as any)}
                style={stylesheet.container}
                onTouchEnd={() => this._onTouchEnd()}>
                <MarkerIcon style={stylesheet.icon} />
                <View style={{marginLeft: 10}}>
                    <Text style={stylesheet.address}>{address}</Text>
                    <Text style={stylesheet.region}>{region}</Text>
                    <Text style={stylesheet.phone}>{this.props.restaurant.phone}</Text>
                </View>
            </Animatable.View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingLeft: 10,
        paddingTop: 10,
    },
    icon: {
        marginTop: 8,
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
