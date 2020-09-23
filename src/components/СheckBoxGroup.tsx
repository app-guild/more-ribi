import React, {PureComponent} from "react";
import {StyleSheet, Text, View} from "react-native";
import {CheckBox} from "react-native-elements";
import {globalColors} from "../../resources/styles";

export interface ICheckBoxSelectState {
    checked: boolean[];
    choiceLimit?: number;
}

export interface ICheckBoxSelectProps {
    choices: string[];
    choiceType: "radioButton" | "checkBox";
    choicesLocation: "bottom" | "left";
    choiceLimit?: number;
    additionalText?: string[];
    initialChoices?: boolean[];
    canUncheck?: boolean;
    onClick?: (values: boolean[], changed: boolean, changedIndex: number, id: number) => void;
    id?: number;
}

class CheckBoxGroup extends PureComponent<Readonly<ICheckBoxSelectProps>, Readonly<ICheckBoxSelectState>> {
    constructor(props: ICheckBoxSelectProps) {
        super(props);
        this.state = {
            checked: props.initialChoices ? props.initialChoices : new Array(props.choices.length).fill(false),
            choiceLimit: this.props.choiceLimit,
        };
        if (!props.initialChoices && props.choiceType === "radioButton" && !props.canUncheck) {
            this.state.checked[0] = true;
        }
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
        } else if (this.props.choiceType === "radioButton") {
            if (this.props.canUncheck) {
                if (checked[index]) {
                    checked[index] = false;
                } else {
                    checked.fill(false);
                    checked[index] = true;
                }
            } else {
                checked.fill(false);
                checked[index] = !checked[index];
            }
        } else {
            checked[index] = !checked[index];
        }
        this.setState({checked: checked}, () => {
            if (this.props.onClick) {
                this.props.onClick(
                    this.state.checked,
                    oldValue !== this.state.checked[index],
                    index,
                    this.props.id ? this.props.id : 0,
                );
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

    render() {
        //console.log("RENDER: CheckGroup", this.props.id ? this.props.id : this.props.choices[0]);
        const {choices, choiceType, additionalText} = this.props;

        return choices.map((val: any, index: any) => (
            <View
                key={index}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: "100%",
                }}>
                <CheckBox
                    checked={this.state.checked[index]}
                    onPress={() => this.onCheckBoxPress(index)}
                    wrapperStyle={{paddingVertical: 4}}
                    containerStyle={{
                        padding: 0,
                        margin: 0,
                    }}
                    checkedIcon={choiceType === "radioButton" ? "dot-circle-o" : undefined}
                    uncheckedIcon={choiceType === "radioButton" ? "circle-o" : undefined}
                />

                <Text style={stylesheet.radioButtonText}>{val + " "}</Text>
                <Text style={stylesheet.additionalText}>{additionalText ? additionalText[index] : null}</Text>
            </View>
        ));
    }
}

export const stylesheet = StyleSheet.create({
    radioButtonText: {
        flex: 1,
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
