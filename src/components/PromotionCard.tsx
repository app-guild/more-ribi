import React, {Component} from "react";
import {Image, StyleSheet, View, Text, TouchableOpacity, Linking} from "react-native";

interface IPromotionCardProps {
    text: string;
    imageUrl?: string;
    linkToPromotion?: string;
    headerText?: string;
}

export default class PromotionCard extends Component<Readonly<IPromotionCardProps>, any> {
    constructor(props: IPromotionCardProps) {
        super(props);
    }

    private _onImagePress = () => {
        if (this.props.linkToPromotion && Linking.canOpenURL(this.props.linkToPromotion)) {
            Linking.openURL(this.props.linkToPromotion);
        }
    };

    render() {
        const textStyle = {...stylesheet.text};
        if (!this.props.headerText) {
            textStyle.color = "#000000";
        }

        return (
            <View>
                {this.props.imageUrl ? (
                    <TouchableOpacity onPress={this._onImagePress}>
                        <Image source={{uri: this.props.imageUrl}} style={stylesheet.image} />
                    </TouchableOpacity>
                ) : null}
                {this.props.headerText ? (
                    <Text style={stylesheet.header} numberOfLines={1}>
                        {this.props.headerText}
                    </Text>
                ) : null}
                <Text style={textStyle} numberOfLines={2} ellipsizeMode={"tail"}>
                    {this.props.text}
                </Text>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    image: {
        height: 220,
    },
    header: {
        fontFamily: "Mulish",
        fontSize: 16,
        marginTop: 10,
    },
    text: {
        fontFamily: "Mulish",
        fontSize: 12,
        color: "#909193",
        marginTop: 10,
    },
});
