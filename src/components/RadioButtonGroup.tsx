import React, {PureComponent} from "react";
import {StyleSheet, Text, View} from "react-native";
import {CheckBox} from "react-native-elements";
import {globalColors} from "../../resources/styles";
import Ingredient from "../entities/Ingredient";

export interface IRadioButtonGroupState {
    checked: number;
}

export interface IRadioButtonGroupProps {
    choices: Ingredient[];
    needAdditionalText?: boolean;
    canUncheck?: boolean;
    onClick?: (prevState: boolean[], currentState: boolean[], id: number) => void;
    id?: number;
}

class RadioButtonGroup extends PureComponent<Readonly<IRadioButtonGroupProps>, Readonly<IRadioButtonGroupState>> {
    constructor(props: IRadioButtonGroupProps) {
        super(props);
        this.state = {
            checked: props.canUncheck ? -1 : 0,
        };
        this.clearContent = this.clearContent.bind(this);
        this.getCheckedNumber = this.getCheckedNumber.bind(this);
    }

    getCheckedNumber() {
        return this.state.checked;
    }

    onRadioButtonPress(index: number) {
        this.setState({checked: this.state.checked === index && this.props.canUncheck ? -1 : index}, () => {
            if (this.props.onClick) {
                // this.props.onClick(
                //     this.state.checked,
                //     oldValue !== this.state.checked[index],
                //     index,
                //     this.props.id ? this.props.id : 0,
                // );
            }
        });
    }

    public clearContent() {
        this.setState({checked: -1});
    }

    render() {
        const {choices} = this.props;
        const needAdditionalText = this.props.needAdditionalText ? this.props.needAdditionalText : false;
        return choices.map((val, index) => (
            <View key={index} style={stylesheet.container}>
                <CheckBox
                    checked={this.state.checked === index}
                    onPress={() => this.onRadioButtonPress(index)}
                    wrapperStyle={{paddingVertical: 4}}
                    containerStyle={{
                        padding: 0,
                        margin: 0,
                    }}
                    checkedIcon={"dot-circle-o"}
                    uncheckedIcon={"circle-o"}
                />

                <Text style={stylesheet.radioButtonText}>{val.name + " "}</Text>
                <Text style={stylesheet.additionalText}>
                    {needAdditionalText ? "(+" + val.additionalPrice + "₽)" : null}
                </Text>
            </View>
        ));
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    radioButtonText: {
        //flex: 1,
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 20,
        lineHeight: 20,
        color: globalColors.mainTextColor,
    },
    additionalText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 20,
        lineHeight: 20,
        color: globalColors.additionalTextColor,
    },
});

export default RadioButtonGroup;
