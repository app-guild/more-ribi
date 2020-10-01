import React, {PureComponent} from "react";
import {StyleSheet, Text, View} from "react-native";
import RadioForm from "react-native-simple-radio-button";
import {globalColors} from "../../resources/styles";
import Ingredient from "../entities/Ingredient";
import CheckBox from "./CheckBox";

export interface ICheckBoxGroupState {
    checked: boolean[];
    choiceLimit?: number;
}

export interface ICheckBoxGroupProps {
    choices: Ingredient[];
    needAdditionalText?: boolean;
    choiceLimit?: number;
    additionalText?: string[];
    onClick?: (changed: boolean) => void;
    id?: number;
}

class CheckBoxGroup extends PureComponent<Readonly<ICheckBoxGroupProps>, Readonly<ICheckBoxGroupState>> {
    constructor(props: ICheckBoxGroupProps) {
        super(props);
        this.state = {
            checked: new Array(props.choices.length).fill(false),
            choiceLimit: this.props.choiceLimit,
        };
        this.clearContent = this.clearContent.bind(this);
        this.setLimit = this.setLimit.bind(this);
    }

    getCheckCount() {
        let count = 0;
        this.state.checked.forEach((value) => (value ? count++ : null));
        return count;
    }

    onCheckBoxPress(index: number) {
        const oldValue = this.state.checked[index];
        let checked = this.state.checked.slice();

        if (this.state.choiceLimit && this.getCheckCount() >= this.state.choiceLimit) {
            if (checked[index]) {
                checked[index] = false;
            }
        } else {
            checked[index] = !checked[index];
        }
        this.setState({checked: checked}, () => {
            if (this.props.onClick) {
                this.props.onClick(oldValue !== this.state.checked[index]);
            }
        });
    }

    public setLimit(limit: number | undefined) {
        if (limit && this.getCheckCount() > limit) {
            this.clearContent();
        }
        this.setState({choiceLimit: limit});
    }

    public clearContent() {
        this.setState({checked: this.state.checked.fill(false)});
    }

    public getCheckedIndexes(): number[] {
        let result: number[] = [];
        this.state.checked.forEach((val, index) => {
            if (val) {
                result.push(index);
            }
        });
        return result;
    }

    public getCheckedText(): string {
        let result: string = "";
        this.state.checked.forEach((val, index) => {
            if (val) {
                result = result.concat(this.props.choices[index].name + ", ");
            }
        });
        return result.slice(0, -2);
    }

    render() {
        console.log("RENDER: CBGroup", this.props.choices[0] ? this.props.choices[0].name : "хз шо");
        const {choices} = this.props;
        const needAdditionalText = this.props.needAdditionalText ? this.props.needAdditionalText : false;

        return (
            <RadioForm animation={false}>
                {choices.map((obj, i) => (
                    <View key={i}>
                        <CheckBox
                            label={obj.name}
                            labelStyle={stylesheet.radioButtonText}
                            isSelected={this.state.checked[i]}
                            onPress={() => this.onCheckBoxPress(i)}
                            borderWidth={1}
                            buttonSize={18}
                            buttonOuterSize={20}
                        />
                        {needAdditionalText ? (
                            <Text style={stylesheet.additionalText}>{" (+" + obj.additionalPrice + "₽)"}</Text>
                        ) : null}
                    </View>
                ))}
            </RadioForm>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    radioButtonText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 20,
        lineHeight: 24,
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

export default CheckBoxGroup;
