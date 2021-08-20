import React, {PureComponent} from "react";
import {Text, TextStyle} from "react-native";
import {stylesheet} from "./СheckBoxGroup";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from "react-native-simple-radio-button";
import {globalColors} from "../../resources/styles";

export interface IRadioButtonGroupState {
    checked: number;
}

export interface IRadioButtonGroupProps {
    choices: {name: string}[];
    needAdditionalText?: boolean;
    canUncheck?: boolean;
    labelStyle?: TextStyle;
    onClick?: (changed: boolean) => void;
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

    public getCheckedNumber(): number {
        return this.state.checked;
    }

    public getCheckedIndexes(): number[] {
        return this.getCheckedNumber() === -1 ? [] : [this.getCheckedNumber()];
    }

    public getCheckedText(): string {
        return this.state.checked === -1 ? "" : this.props.choices[this.state.checked].name;
    }

    onRadioButtonPress(index: number) {
        const oldValue = this.state.checked;
        this.setState({checked: this.state.checked === index && this.props.canUncheck ? -1 : index}, () => {
            if (this.props.onClick) {
                this.props.onClick(oldValue !== this.state.checked);
            }
        });
    }

    public clearContent() {
        this.setState({checked: -1});
    }

    render() {
        const {choices} = this.props;
        const needAdditionalText = this.props.needAdditionalText ? this.props.needAdditionalText : false;
        return (
            <RadioForm animation={false}>
                {choices.map((obj, i) => (
                    <RadioButton labelHorizontal={true} key={i}>
                        <RadioButtonInput
                            obj={{label: obj.name, value: i}}
                            isSelected={this.state.checked === i}
                            onPress={() => this.onRadioButtonPress(i)}
                            borderWidth={1}
                            buttonSize={18}
                            buttonOuterSize={20}
                            buttonInnerColor={globalColors.primaryColor}
                            buttonOuterColor={globalColors.mainTextColor}
                            buttonWrapStyle={{marginLeft: 10, borderRadius: 0, alignSelf: "center"}}
                        />
                        <RadioButtonLabel
                            obj={{label: obj.name, value: i}}
                            labelHorizontal={true}
                            onPress={() => this.onRadioButtonPress(i)}
                            labelStyle={this.props.labelStyle ? this.props.labelStyle : stylesheet.radioButtonText}
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

export default RadioButtonGroup;
