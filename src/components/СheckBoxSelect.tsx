import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {CheckBox} from "react-native-elements";
import {IPokeConstructorCardProps, IPokeConstructorCardState} from "./PokeConstructorCard";

export interface ICheckBoxSelectState {
    checked: boolean[];
}

export interface ICheckBoxSelectProps {
    choices: string[];
    choiceType: "radioButton" | "checkBox";
    width: number;
    choiceLimit?: number;
}

class CheckBoxSelect extends Component<Readonly<ICheckBoxSelectProps>, Readonly<ICheckBoxSelectState>> {
    constructor(props: ICheckBoxSelectProps) {
        super(props);
        this.state = {checked: new Array(props.choices.length).fill(false)};
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
        const {choices, choiceType, width, choiceLimit} = this.props;
        const choicesList = choices.map((val: any, index: any) => (
            <View
                key={index}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    width: width,
                }}>
                <CheckBox
                    checked={this.state.checked[index]}
                    onPress={() => {
                        if (choiceLimit && this.getCheckCount() >= choiceLimit) {
                            if (this.state.checked[index]) {
                                this.state.checked.splice(index, 1, false);
                                this.setState({checked: this.state.checked});
                            }
                        } else if (choiceType === "radioButton") {
                            this.state.checked.fill(false).splice(index, 1, !this.state.checked[index]);
                            this.setState({checked: this.state.checked});
                        } else {
                            this.state.checked.splice(index, 1, !this.state.checked[index]);
                            this.setState({checked: this.state.checked});
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
                <Text
                    style={{
                        ...stylesheet.radioButtonText,
                        // width:
                        //     choicesLocation === "bottom"
                        //         ? width + (this.screenWidth - width) / 2 - checkBoxWidth
                        //         : width - checkBoxWidth,
                    }}>
                    {val}
                </Text>
            </View>
        ));
        return choicesList;
    }
}

export const stylesheet = StyleSheet.create({
    width2: {
        width: 100,
    },
});

export default CheckBoxSelect;
