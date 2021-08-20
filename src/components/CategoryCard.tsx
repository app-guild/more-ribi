import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";

export interface ICategoryCardState {}

export interface ICategoryCardProps {
    width: number | string;
    height?: number | string;
    text: string;
    additionalText?: string;
    onTouchEnd: any;
    imageSource: any;
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
                    source={this.props.imageSource}
                    style={{
                        width: width,
                        height: height,
                        borderRadius: stylesheet.card.borderRadius,
                        position: "absolute",
                    }}
                />
                <View style={{flex: 1, justifyContent: "center", top: additionalText ? undefined : "15%"}}>
                    {additionalText ? <Text style={stylesheet.additionalText}>{additionalText}</Text> : null}
                    <View
                        style={
                            additionalText
                                ? {
                                      ...stylesheet.titleContainer,
                                      ...stylesheet.pokeConstructor,
                                  }
                                : stylesheet.titleContainer
                        }>
                        <Text style={stylesheet.text}>{text}</Text>
                    </View>
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
        marginHorizontal: 32,
        color: globalColors.whiteTextColor,
    },
    pokeConstructor: {
        alignItems: "flex-start",
        paddingHorizontal: 32,
    },
});

export default CategoryCard;
