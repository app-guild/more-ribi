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
    textColor?: any;
    buttonColor?: any;
}

class CheckBox extends PureComponent<Readonly<ICheckBoxProps>, Readonly<ICheckBoxState>> {
    constructor(props: ICheckBoxProps) {
        super(props);
        this.state = {
            checked: props.isSelected,
        };
    }

    render() {
        const {
            label,
            labelStyle,
            isSelected,
            onPress,
            borderWidth,
            buttonSize,
            buttonOuterSize,
            buttonColor,
        } = this.props;

        return (
            <View style={{...stylesheet.container, backgroundColor: buttonColor}} onTouchEnd={onPress}>
                <View
                    style={{
                        ...stylesheet.checkboxContainer,
                        width: buttonOuterSize,
                        height: buttonOuterSize,
                        borderWidth: borderWidth,
                    }}>
                    <View
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            backgroundColor: isSelected ? globalColors.primaryColor : "transparent",
                        }}
                    />
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
        paddingHorizontal: 10,
        paddingVertical: 3,
        marginVertical: 2,
        borderRadius: 10,
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
});

export default CheckBox;
