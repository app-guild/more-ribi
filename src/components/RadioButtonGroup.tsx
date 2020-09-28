import React, {PureComponent} from "react";
import {Text, View} from "react-native";
import {CheckBox} from "react-native-elements";
import Ingredient from "../entities/Ingredient";
import {stylesheet} from "./СheckBoxGroup";

export interface IRadioButtonGroupState {
    checked: number;
}

export interface IRadioButtonGroupProps {
    choices: Ingredient[];
    needAdditionalText?: boolean;
    canUncheck?: boolean;
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
                {needAdditionalText ? (
                    <Text style={stylesheet.additionalText}>"(+" + val.additionalPrice + "₽)"</Text>
                ) : null}
            </View>
        ));
    }
}

export default RadioButtonGroup;
