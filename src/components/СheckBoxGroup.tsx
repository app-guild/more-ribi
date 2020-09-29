import React, {PureComponent} from "react";
import {StyleSheet, Text} from "react-native";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import {globalColors} from "../../resources/styles";
import Ingredient from "../entities/Ingredient";

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
                    <RadioButton labelHorizontal={true} key={i}>
                        <RadioButtonInput
                            obj={{label: obj.name, value: i}}
                            isSelected={this.state.checked[i]}
                            onPress={() => this.onCheckBoxPress(i)}
                            borderWidth={1}
                            buttonSize={22}
                            buttonOuterSize={24}
                            buttonInnerColor={globalColors.primaryColor}
                            buttonOuterColor={globalColors.mainTextColor}
                            buttonStyle={{borderRadius: 0, flex: 1}}
                            buttonWrapStyle={{marginLeft: 10, borderRadius: 0}}
                        />
                        <RadioButtonLabel
                            obj={{label: obj.name, value: i}}
                            labelHorizontal={true}
                            onPress={() => this.onCheckBoxPress(i)}
                            labelStyle={stylesheet.radioButtonText}
                        />
                        {needAdditionalText ? (
                            <Text style={stylesheet.additionalText}>{" (+" + obj.additionalPrice + "₽)"}</Text>
                        ) : null}
                    </RadioButton>
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

export default CheckBoxGroup;
