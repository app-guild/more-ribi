import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {CheckBox} from "react-native-elements";
import {globalColors} from "../../resources/styles";

export interface ICheckBoxSelectState {
    checked: boolean[];
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

class CheckBoxGroup extends Component<Readonly<ICheckBoxSelectProps>, Readonly<ICheckBoxSelectState>> {
    constructor(props: ICheckBoxSelectProps) {
        super(props);
        this.state = {
            checked: props.initialChoices ? props.initialChoices : new Array(props.choices.length).fill(false),
        };
        if (!props.initialChoices && props.choiceType === "radioButton" && !props.canUncheck) {
            this.state.checked[0] = true;
        }
    }

    getCheckCount() {
        let count = 0;
        this.state.checked.forEach((value) => (value ? count++ : null));
        return count;
    }

    componentDidUpdate(prevProps: Readonly<Readonly<ICheckBoxSelectProps>>) {
        if (this.props.choiceLimit && prevProps.choiceLimit && prevProps.choiceLimit > this.props.choiceLimit) {
            this.state.checked.fill(false);
            this.setState({});
        }
    }

    render() {
        const {choices, choiceType, choiceLimit, additionalText, canUncheck} = this.props;

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
                    onPress={() => {
                        const oldValue = this.state.checked[index];
                        if (choiceLimit && this.getCheckCount() >= choiceLimit) {
                            if (this.state.checked[index]) {
                                this.state.checked[index] = false;
                            }
                        } else if (choiceType === "radioButton") {
                            if (canUncheck) {
                                if (this.state.checked[index]) {
                                    this.state.checked[index] = false;
                                } else {
                                    this.state.checked.fill(false);
                                    this.state.checked[index] = true;
                                }
                            } else {
                                this.state.checked.fill(false);
                                this.state.checked[index] = !this.state.checked[index];
                            }
                        } else {
                            this.state.checked[index] = !this.state.checked[index];
                        }
                        this.setState({});
                        if (this.props.onClick) {
                            this.props.onClick(
                                this.state.checked,
                                oldValue !== this.state.checked[index],
                                index,
                                this.props.id ? this.props.id : 0,
                            );
                        }
                    }}
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
