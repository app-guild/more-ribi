import React, {Component, createRef} from "react";
import {Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import Divider from "../components/Divider";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import KeyValueStorage from "../utils/KeyValueStorage";
import EmailService from "../utils/email/EmailService";
import InfoModal from "../components/InfoModal";

export interface IFeedbackScreenState {
    enabledButton: boolean;
    name: string;
    comment: string;
    buttonVisible: boolean;
}

export default class FeedbackScreen extends Component<Readonly<any>, Readonly<IFeedbackScreenState>> {
    private infoModal = createRef<InfoModal>();

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
        return new Promise(() => {
            if (this.state.enabledButton) {
                if (this.infoModal && this.infoModal.current) {
                    this.infoModal.current.startLoadAnimation();
                }
                KeyValueStorage.setUserName(this.state.name)
                    .then(() => EmailService.sendFeedback(this.state.name, this.state.comment))
                    .then(() => this.setState({comment: "", enabledButton: false}))
                    .then(() => {
                        if (this.infoModal && this.infoModal.current) {
                            this.infoModal.current.endLoadAnimation(
                                true,
                                () => {
                                    this.setState({comment: "", enabledButton: false});
                                },
                                InfoModal.SUCCESSFUL_SEND_FEEDBACK_PATTERN,
                            );
                        }
                    })
                    .catch(() => {
                        if (this.infoModal && this.infoModal.current) {
                            this.infoModal.current.endLoadAnimation(
                                false,
                                () => {},
                                InfoModal.FAILED_SEND_FEEDBACK_PATTERN,
                            );
                        }
                    });
            }
        });
    };

    private _checkButtonState(): void {
        const enabledButton = !!this.state.name && !!this.state.comment;
        this.setState({enabledButton});
    }

    render() {
        const buttonColor = this.state.enabledButton ? globalColors.primaryColor : globalColors.fadePrimaryColor;

        return (
            <View style={stylesheet.container}>
                <KeyboardAwareScrollView style={{padding: 14}}>
                    <View>
                        <Text style={stylesheet.subheader}>Мы будем очень рады, если вы оставите Ваш отзыв</Text>
                    </View>

                    <Divider style={stylesheet.divider} />

                    <View style={stylesheet.bodyContainer}>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={stylesheet.rowText}
                                onChangeText={this._onChangeName}
                                value={this.state.name}
                                placeholder={"Имя"}
                            />
                        </View>
                        <View style={stylesheet.row}>
                            <TextInput
                                style={{...stylesheet.rowText, ...stylesheet.rowTextMultiline}}
                                onChangeText={this._onChangeComment}
                                value={this.state.comment}
                                placeholder={"Отзыв"}
                                multiline
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                {this.state.buttonVisible ? (
                    <View style={stylesheet.buttonContainer}>
                        <TouchableOpacity
                            style={{...stylesheet.button, backgroundColor: buttonColor}}
                            onPress={this._onPressSend}>
                            <Text style={stylesheet.buttonText}>Отправить</Text>
                        </TouchableOpacity>
                    </View>
                ) : null}
                <InfoModal ref={this.infoModal} />
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
    },
    bodyContainer: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-between",
    },
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
    buttonContainer: {
        width: "100%",
    },
    button: {
        width: "100%",
        paddingVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: globalColors.primaryColor,
    },
    buttonText: {
        ...globalStylesheet.primaryText,
        color: globalColors.mainBackgroundColor,
    },
    row: {
        marginVertical: 10,
        flex: 1,
        flexDirection: "row",
    },
    rowHeader: {
        ...globalStylesheet.headerText,
        paddingHorizontal: 12,
        flex: 1,
        flexDirection: "row",
    },
    rowText: {
        ...globalStylesheet.primaryText,
        padding: 12,
        flex: 1,
        flexDirection: "row",
        marginHorizontal: 14,
        borderColor: globalColors.fadePrimaryColor,
        borderWidth: 1,
    },
    rowTextMultiline: {
        minHeight: 120,
        maxHeight: 300,
        textAlignVertical: "top",
    },
});
