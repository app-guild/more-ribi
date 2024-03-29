import React, {PureComponent} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";
import CheckBoxGroup from "./СheckBoxGroup";
import Ingredient from "../entities/Ingredient";
import RadioButtonGroup from "./RadioButtonGroup";

export interface IPokeConstructorCardState {
    checked: boolean[];
}

export interface IPokeConstructorCardProps {
    data: IPokeConstructorCardData;
}

export enum ChoiceType {
    RadioButton = "radioButton",
    CheckBox = "checkBox",
}

export enum ChoicesLocation {
    Right = "right",
    Bottom = "bottom",
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
        if (this.groupRef instanceof CheckBoxGroup)
            this.groupRef?.setLimit(limit);
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
                              alignItems: "center",
                              flexDirection: "column",
                          }
                        : {
                              ...stylesheet.container,
                              alignItems: "flex-start",
                          }
                }>
                <View style={{flex: 1, width: "50%"}}>
                    <View style={stylesheet.centredFlexEndRow}>
                        <View>
                            <Text
                                style={
                                    number % 2
                                        ? {...stylesheet.number, ...stylesheet.odd}
                                        : {...stylesheet.number, ...stylesheet.even}
                                }>
                                {number}
                            </Text>
                            <Image source={smallImage} style={stylesheet.smallImage} />
                        </View>
                        <Text numberOfLines={2} style={stylesheet.title}>
                            {title}
                        </Text>
                    </View>
                    {image ? <Image source={image} style={stylesheet.image} /> : null}
                </View>
                <View
                    style={{
                        marginTop: 20,
                        flex: 1,
                        marginLeft:
                            choicesLocation === ChoicesLocation.Bottom ? 0 : stylesheet.spaceBetweenColumns.marginLeft,
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
    number: {
        fontFamily: "Montserrat-Bold",
        fontSize: 60,
        lineHeight: 60,
        color: globalColors.mainTextColor,
    },
    title: {
        fontFamily: "Montserrat-ExtraBold",
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
    centredFlexEndRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
    },
    image: {
        borderRadius: 1000,
        width: "100%",
        height: "auto",
        aspectRatio: 1.5,
    },
    smallImage: {
        position: "absolute",
        width: 25,
        height: 25,
        left: 17,
        top: 32,
    },
});

export default PokeConstructorCard;
