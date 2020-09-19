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
        const {choices, choiceType, choiceLimit} = this.props;
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
                <Text style={stylesheet.radioButtonText}>{val}</Text>
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
});

export default CheckBoxSelect;
