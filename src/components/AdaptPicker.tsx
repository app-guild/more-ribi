import React, {Component} from "react";
import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import {Overlay} from "react-native-elements";
import {Picker} from "@react-native-community/picker";

export interface IAdaptPickerProps {
    initValue?: string;
    items: string[];
    onValueChange?: (newValue: string) => void;
}

export interface IAdaptPickerState {
    currentValue: string;
    isModalVisible: boolean;
}

export default class AdaptPicker extends Component<IAdaptPickerProps, IAdaptPickerState> {
    constructor(props: IAdaptPickerProps) {
        super(props);
        this.state = {
            currentValue: props.initValue ? props.initValue : props.items[0],
            isModalVisible: false,
        };
    }

    shouldComponentUpdate(nextProps: Readonly<IAdaptPickerProps>): boolean {
        if (nextProps.initValue !== this.props.initValue) {
            this.setState({currentValue: nextProps.initValue ? nextProps.initValue : nextProps.items[0]});
        }
        return true;
    }

    private onValueChange(newValue: string) {
        if (this.props.onValueChange) {
            this.props.onValueChange(newValue);
        }
        this.setState({currentValue: newValue});
    }

    render() {
        return Platform.OS === "ios" ? (
            <>
                <TouchableOpacity
                    style={stylesheet.iosPickerLabel}
                    onPress={() => this.setState({isModalVisible: true})}>
                    <Text style={{...globalStylesheet.secondaryText, fontSize: 14}}>{this.state.currentValue}</Text>
                </TouchableOpacity>
                <Overlay
                    isVisible={this.state.isModalVisible}
                    style={{margin: 0}}
                    onBackdropPress={() => {
                        this.setState({isModalVisible: false});
                    }}>
                    <View style={stylesheet.iosPickerContainer}>
                        <Picker
                            mode={"dropdown"}
                            selectedValue={this.state.currentValue}
                            onValueChange={(itemValue) => this.onValueChange(itemValue.toString())}>
                            {this.props.items.map((value, i) => (
                                <Picker.Item key={i} label={value} value={value} />
                            ))}
                        </Picker>
                    </View>
                </Overlay>
            </>
        ) : (
            <Picker
                mode={"dialog"}
                selectedValue={this.state.currentValue}
                style={stylesheet.picker}
                onValueChange={(itemValue) => this.onValueChange(itemValue.toString())}>
                {this.props.items.map((value, i) => (
                    <Picker.Item key={i} label={value} value={value} />
                ))}
            </Picker>
        );
    }
}

const stylesheet = StyleSheet.create({
    text: {
        minWidth: 55,
        color: globalColors.additionalTextColor,
    },
    centredRow: {
        flexDirection: "row",
        marginTop: 10,
        backgroundColor: "red",
    },
    picker: {
        width: "140%",
        height: 30,
        paddingVertical: 10,
        padding: 0,
        margin: 0,
        color: globalColors.additionalTextColor,
        backgroundColor: globalColors.almostTransparent,
    },
    iosPickerLabel: {
        width: "100%",
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        color: globalColors.additionalTextColor,
        backgroundColor: globalColors.almostTransparent,
    },
    pickers: {
        width: "50%",
    },
    iosPickerContainer: {
        backgroundColor: globalColors.cardBackgroundColor,
        height: "30%",
        alignContent: "center",
        justifyContent: "center",
        padding: 20,
    },
});
