import React, {Component} from "react";
import {Text, View, Dimensions, StyleSheet, Image} from "react-native";
import {globalColors} from "../../resources/styles";
import CheckBoxSelect from "./СheckBoxSelect";

export interface IPokeConstructorCardState {
    checked: boolean[];
}

export interface IPokeConstructorCardProps {
    title: string;
    number: number;
    image: any;
    smallImage: any;
    choices: string[];
    choiceType: "radioButton" | "checkBox";
    choicesLocation: "bottom" | "left";
    choiceLimit?: number;
}

class PokeConstructorCard extends Component<Readonly<IPokeConstructorCardProps>, Readonly<IPokeConstructorCardState>> {
    private readonly screenWidth = Dimensions.get("window").width;

    constructor(props: IPokeConstructorCardProps) {
        super(props);
        this.state = {checked: new Array(props.choices.length).fill(false)};
    }

    render() {
        const {title, number, image, smallImage, choices, choiceType, choicesLocation, choiceLimit} = this.props;
        const halfWidth = (this.screenWidth - 2 * stylesheet.container.paddingHorizontal) / 2;

        return (
            <View
                style={
                    choicesLocation === "bottom"
                        ? {
                              ...stylesheet.container,
                              flexDirection: "column",
                              alignItems: "center",
                          }
                        : {
                              ...stylesheet.container,
                              flexDirection: "row",
                              alignItems: "flex-start",
                          }
                }>
                <View style={{width: halfWidth}}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            justifyContent: "center",
                        }}>
                        <View>
                            <Text
                                style={
                                    number % 2
                                        ? {...stylesheet.number, ...stylesheet.odd}
                                        : {...stylesheet.number, ...stylesheet.even}
                                }>
                                {number}
                            </Text>
                            <Image
                                source={smallImage}
                                style={{
                                    position: "absolute",
                                    width: 25,
                                    height: 25,
                                    left: 17,
                                    top: 32,
                                }}
                            />
                        </View>
                        <Text numberOfLines={2} style={stylesheet.subTitleText}>
                            {title}
                        </Text>
                    </View>
                    <Image
                        source={image}
                        style={{
                            borderRadius: halfWidth / 4,
                            width: halfWidth,
                            height: "auto",
                            aspectRatio: 1.5,
                        }}
                    />
                </View>
                <View
                    style={{
                        marginTop: 20,
                        marginLeft: choicesLocation === "bottom" ? 0 : stylesheet.spaceBetweenColumns.marginLeft,
                    }}>
                    <CheckBoxSelect
                        choices={choices}
                        choiceType={choiceType}
                        choicesLocation={choicesLocation}
                        width={halfWidth}
                        choiceLimit={choiceLimit}
                    />
                </View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginTop: 40,
        paddingHorizontal: 20,
    },
    topText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 28,
        color: globalColors.whiteTextColor,
        paddingVertical: 40,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    titleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 24,
        color: globalColors.mainTextColor,
        paddingVertical: 14,
        textAlign: "center",
    },
    descriptionText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 13,
        color: globalColors.mainTextColor,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    number: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 60,
        lineHeight: 60,
        color: globalColors.mainTextColor,
    },
    subTitleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 23,
        //lineHeight: 50,
        marginBottom: 8,
        color: globalColors.mainTextColor,
        marginLeft: 12,
    },
    odd: {
        color: globalColors.primaryColor,
    },
    even: {
        color: globalColors.orangeColor,
    },
    spaceBetweenColumns: {
        marginLeft: 20,
    },
});

export default PokeConstructorCard;
