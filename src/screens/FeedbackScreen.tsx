import React, {Component} from "react";
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {globalColors} from "../../resources/styles";
import {Divider} from "react-native-paper";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import KeyValueStorage from "../utils/KeyValueStorage";

export interface IFeedbackScreenState {
    enabledButton: boolean;
    name: string;
    comment: string;
    buttonVisible: boolean;
}

export default class FeedbackScreen extends Component<Readonly<any>, Readonly<IFeedbackScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            enabledButton: false,
            name: "",
            comment: "",
            buttonVisible: true,
        };

        Keyboard.addListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.addListener("keyboardDidHide", this._keyboardDidHide);
    }

    componentDidMount() {
        return KeyValueStorage.getUserName().then((name) => this.setState({name}));
    }

    componentWillUnmount() {
        Keyboard.removeListener("keyboardDidShow", this._keyboardDidShow);
        Keyboard.removeListener("keyboardDidHide", this._keyboardDidHide);
    }

    private _keyboardDidShow = () => {
        this.setState({buttonVisible: false});
    };

    private _keyboardDidHide = () => {
        this.setState({buttonVisible: true});
    };

    private _onChangeName = (name: string) => {
        this.setState({name});
        this._checkButtonState();
    };

    private _onChangeComment = (comment: string) => {
        this.setState({comment});
        this._checkButtonState();
    };

    private _onPressSend = () => {
        if (this.state.enabledButton) {
            this.setState({comment: "", enabledButton: false});
            KeyValueStorage.setUserName(this.state.name);
            // TODO send comment
        }
    };

    private _checkButtonState(): void {
        const enabledButton = !!this.state.name && !!this.state.comment;
        this.setState({enabledButton});
    }

    render() {
        const buttonColor = this.state.enabledButton ? colors.enabledButton : colors.disabledButton;

        return (
            <KeyboardAwareScrollView contentContainerStyle={{minHeight: "100%"}}>
                <View>
                    <Text style={stylesheet.subheader}>Мы будем очень рады, если вы оставите Ваш отзыв</Text>
                </View>

                <Divider style={stylesheet.divider} />

                <View style={stylesheet.content}>
                    <TextInput
                        style={{...stylesheet.input, ...stylesheet.nameInput}}
                        onChangeText={this._onChangeName}
                        value={this.state.name}
                        placeholder={"Имя"}
                    />
                    <TextInput
                        style={{...stylesheet.input, ...stylesheet.commentInput}}
                        onChangeText={this._onChangeComment}
                        value={this.state.comment}
                        placeholder={"Отзыв"}
                        multiline
                    />
                </View>

                {this.state.buttonVisible ? (
                    <View style={stylesheet.buttonContainer}>
                        <TouchableOpacity
                            style={{...stylesheet.button, backgroundColor: buttonColor}}
                            onPress={this._onPressSend}>
                            <Text style={stylesheet.buttonText}>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
            </KeyboardAwareScrollView>
        );
    }
}

const colors = {
    enabledButton: globalColors.primaryColor,
    disabledButton: "#D1DAE2",
};

const stylesheet = StyleSheet.create({
    subheader: {
        alignSelf: "center",
        fontFamily: "Mulish",
        fontSize: 14,
        color: globalColors.additionalTextColor,
        textAlign: "center",
        maxWidth: 300,
    },
    divider: {
        width: "90%",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 25,
    },
    content: {
        minHeight: 200,
        width: "90%",
        alignSelf: "center",
    },
    buttonContainer: {
        position: "absolute",
        width: "100%",
        bottom: 0,
    },
    button: {
        height: 70,
        alignItems: "center",
        borderTopStartRadius: 9,
        borderTopEndRadius: 9,
    },
    buttonText: {
        textAlignVertical: "center",
        height: "100%",
        fontFamily: "Mulish",
        fontWeight: "700",
        fontSize: 18,
        color: "#FFFFFF",
    },
    input: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "#D1DAE2",
        width: "100%",
    },
    nameInput: {
        height: 50,
        marginBottom: 20,
    },
    commentInput: {
        minHeight: 120,
        maxHeight: 300,
        textAlignVertical: "top",
    },
});
