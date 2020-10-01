import React, {PureComponent} from "react";
import {StyleSheet, Text, TextStyle, View} from "react-native";
import {globalColors} from "../../resources/styles";

export interface ICheckBoxState {
    checked: boolean;
}

export interface ICheckBoxProps {
    label: string;
    isSelected: boolean;
    onPress: () => any;
    borderWidth: number;
    buttonSize: number;
    buttonOuterSize: number;
    labelStyle?: TextStyle;
}

class CheckBox extends PureComponent<Readonly<ICheckBoxProps>, Readonly<ICheckBoxState>> {
    constructor(props: ICheckBoxProps) {
        super(props);
        this.state = {
            checked: props.isSelected,
        };
    }

    render() {
        const {label, labelStyle, isSelected, onPress, borderWidth, buttonSize, buttonOuterSize} = this.props;

        return (
            <View style={stylesheet.container} onTouchEnd={onPress}>
                <View
                    style={{
                        ...stylesheet.checkboxContainer,
                        width: buttonOuterSize,
                        height: buttonOuterSize,
                        borderWidth: borderWidth,
                    }}>
                    {isSelected && (
                        <View
                            style={{
                                ...stylesheet.checkboxButton,
                                width: buttonSize,
                                height: buttonSize,
                            }}
                        />
                    )}
                </View>
                <View style={stylesheet.labelWrapper}>
                    <Text style={{...stylesheet.label, ...labelStyle}}>{label}</Text>
                </View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    label: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 20,
        lineHeight: 24,
        color: globalColors.mainTextColor,
    },
    labelWrapper: {
        marginLeft: 10,
    },
    checkboxContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    checkboxButton: {
        backgroundColor: globalColors.primaryColor,
    },
});

export default CheckBox;
