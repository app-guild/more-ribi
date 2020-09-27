import React, {PureComponent} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";
import CheckBoxGroup from "./СheckBoxGroup";
import Ingredient from "../entities/Ingredient";
import {ChoicesLocation, ChoiceType} from "../screens/PokeConstructorScreen";
import RadioButtonGroup from "./RadioButtonGroup";

export interface IPokeConstructorCardState {
    checked: boolean[];
}

export interface IPokeConstructorCardProps {
    data: IPokeConstructorCardData;
}

export interface IPokeConstructorCardData {
    title: string;
    number: number;
    image?: any;
    smallImage: any;
    ingredients: Ingredient[];
    needAdditionalText?: boolean;
    canUncheck?: boolean;
    choiceType?: ChoiceType;
    choicesLocation?: ChoicesLocation;
    choiceLimit?: number;
    onClick?: (changed: boolean) => void;
}

class PokeConstructorCard extends PureComponent<
    Readonly<IPokeConstructorCardProps>,
    Readonly<IPokeConstructorCardState>
> {
    private groupRef: CheckBoxGroup | RadioButtonGroup | null = null;

    constructor(props: IPokeConstructorCardProps) {
        super(props);
        this.state = {checked: new Array(props.data.ingredients.length).fill(false)};
    }

    public setLimit(limit: number | undefined) {
        this.groupRef instanceof CheckBoxGroup ? this.groupRef?.setLimit(limit) : null;
    }

    public getCheckedIndexes(): number[] {
        return this.groupRef ? this.groupRef.getCheckedIndexes() : [];
    }

    public getCheckedText(): string {
        return this.groupRef ? this.groupRef.getCheckedText() : "";
    }

    render() {
        const {
            title,
            number,
            image,
            smallImage,
            ingredients,
            needAdditionalText,
            canUncheck,
            choiceType,
            choicesLocation,
            choiceLimit,
            onClick,
        } = this.props.data;

        return (
            <View
                style={
                    choicesLocation === ChoicesLocation.Bottom
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
                <View style={{flex: 1, width: "50%"}}>
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
                    {image ? (
                        <Image
                            source={image}
                            style={{
                                borderRadius: 1000,
                                width: "100%",
                                height: "auto",
                                aspectRatio: 1.5,
                            }}
                        />
                    ) : null}
                </View>
                <View
                    style={{
                        marginTop: 20,
                        marginLeft:
                            choicesLocation === ChoicesLocation.Bottom ? 0 : stylesheet.spaceBetweenColumns.marginLeft,
                        flex: 1,
                        width: choicesLocation === ChoicesLocation.Bottom ? "70%" : undefined,
                    }}>
                    {choiceType === ChoiceType.CheckBox ? (
                        <CheckBoxGroup
                            ref={(ref) => {
                                this.groupRef = ref;
                                return true;
                            }}
                            choices={ingredients}
                            needAdditionalText={needAdditionalText}
                            choiceLimit={choiceLimit}
                            onClick={onClick}
                        />
                    ) : (
                        <RadioButtonGroup
                            ref={(ref) => {
                                this.groupRef = ref;
                                return true;
                            }}
                            choices={ingredients}
                            needAdditionalText={needAdditionalText}
                            canUncheck={canUncheck}
                            onClick={onClick}
                        />
                    )}
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
        margin: 20,
        marginLeft: 10,
        marginRight: 10,
    },
});

export default PokeConstructorCard;
