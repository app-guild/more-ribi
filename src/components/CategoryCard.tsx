import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";

export interface ICategoryCardState {}

export interface ICategoryCardProps {
    width: number;
    height?: number;
    text: string;
    additionalText?: string;
    onTouchEnd: any;
    image?: any;
    style?: any;
}

class CategoryCard extends Component<Readonly<ICategoryCardProps>, Readonly<ICategoryCardState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        const {width, text, onTouchEnd, style, additionalText} = this.props;
        const height = this.props.height ? this.props.height : this.props.width;
        return (
            <View
                style={{
                    width: width,
                    height: height,
                    ...stylesheet.card,
                    ...style,
                }}
                onTouchEnd={onTouchEnd}>
                <Image
                    source={require("../../resources/assets/drawable/food.jpg")}
                    style={{
                        width: width,
                        height: height,
                        borderRadius: stylesheet.card.borderRadius,
                        position: "absolute",
                    }}
                />

                {additionalText ? <Text style={{...stylesheet.additionalText}}>{additionalText}</Text> : null}

                <View
                    style={
                        additionalText
                            ? {
                                  ...stylesheet.titleContainer,
                                  marginTop: 5,
                                  marginBottom: 10,
                                  alignItems: "flex-start",
                                  paddingHorizontal: 32,
                              }
                            : {...stylesheet.titleContainer, marginTop: "60%"}
                    }>
                    <Text style={stylesheet.text}>{text}</Text>
                </View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    card: {
        borderRadius: 10,
    },
    titleContainer: {
        width: "100%",
        backgroundColor: globalColors.categoriesScreenCardTitleContainerBGColor,
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 15,
    },
    text: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
        color: globalColors.whiteTextColor,
    },
    additionalText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 18,
        lineHeight: 22,
        marginTop: 27,
        marginHorizontal: 32,
        color: globalColors.whiteTextColor,
    },
});

export default CategoryCard;
