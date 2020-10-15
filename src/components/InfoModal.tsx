import React, {Component} from "react";
import Modal from "react-native-modal";
import {View, Text, StyleSheet, TouchableOpacity} from "react-native";
import * as Progress from "react-native-progress";

export enum InfoModalType {
    INFO,
    LOADING,
}

export enum LoadingState {
    Loading,
    Failure,
    Success,
}

enum InfoType {
    Info,
    Failure,
    Success,
}

interface IProps {
    type: InfoModalType;
    onPressOk: () => void;
}

interface IState {
    modalVisible: boolean;
    loadingState?: LoadingState;
    infoType?: InfoType;
    header?: string;
    text?: string;
}

function getBorderColor(type: InfoType | undefined): string {
    switch (type) {
        case InfoType.Info:
            return BorderColors.INFO;
        case InfoType.Success:
            return BorderColors.SUCCESS;
        case InfoType.Failure:
            return BorderColors.FAILURE;
        default:
            return "";
    }
}

export default class InfoModal extends Component<Readonly<IProps>, Readonly<IState>> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            modalVisible: false,
            infoType: props.type === InfoModalType.INFO ? InfoType.Info : undefined,
        };
    }

    show(): void {
        this.setState({modalVisible: true});
    }

    startLoadAnimation(): void {
        if (this.props.type !== InfoModalType.LOADING) {
            throw Error("Current type not support loading");
        }

        this.setState({loadingState: LoadingState.Loading});
    }

    endLoadAnimation(success: boolean, text: string): void {
        if (this.props.type !== InfoModalType.LOADING) {
            throw Error("Current type not support loading");
        }

        this.setState({
            loadingState: success ? LoadingState.Success : LoadingState.Failure,
            infoType: success ? InfoType.Success : InfoType.Failure,
            text,
        });
    }

    private _hideModal = () => {
        this.setState({modalVisible: false});
    };

    private _onPressOk = () => {
        this._hideModal();
        this.props.onPressOk();
    };

    render() {
        return (
            <Modal
                isVisible={this.state.modalVisible}
                animationIn={"zoomInUp"}
                animationOut={"zoomOutUp"}
                onBackdropPress={this._hideModal}
                onBackButtonPress={this._hideModal}>
                {this.props.type === InfoModalType.LOADING && this.state.loadingState === LoadingState.Loading ? (
                    <View style={{height: "100%"}}>
                        <Spinner />
                    </View>
                ) : (
                    <View style={{...stylesheet.container, borderColor: getBorderColor(this.state.infoType)}}>
                        <Info type={this.state.infoType} text={this.state.text} onPressOk={this._onPressOk} />
                    </View>
                )}
            </Modal>
        );
    }
}

interface IInfoProps {
    text: string | undefined;
    type: InfoType | undefined;
    onPressOk: () => void;
}

function Info(props: IInfoProps) {
    return (
        <View style={{...stylesheet.infoContainer}}>
            <Text style={stylesheet.infoText}>{props.text}</Text>
            <TouchableOpacity
                style={{...stylesheet.button, borderColor: getBorderColor(props.type)}}
                onPress={props.onPressOk}>
                <Text style={stylesheet.buttonText}>ОК</Text>
            </TouchableOpacity>
        </View>
    );
}

function Spinner() {
    return (
        <View style={stylesheet.spinnerContainer}>
            <Progress.CircleSnail
                indeterminate={true}
                color={["#c1272d", "#ffc11e", "#22b573"]}
                size={80}
                thickness={10}
            />
        </View>
    );
}

enum BorderColors {
    INFO = "#779DB9",
    SUCCESS = "#009966",
    FAILURE = "#DD2C2C",
}

const stylesheet = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        paddingHorizontal: 20,
        width: "100%",
        alignSelf: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
        borderWidth: 2,
        borderStyle: "solid",
        borderRadius: 10,
    },
    infoContainer: {
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
    },
    infoText: {
        fontFamily: "Muli",
        textAlign: "center",
        marginTop: 40,
    },
    button: {
        height: 40,
        width: "60%",
        marginBottom: 10,
        marginTop: 40,
        borderWidth: 1,
        borderStyle: "solid",
        borderRadius: 30,
        alignItems: "center",
    },
    buttonText: {
        fontFamily: "Muli",
        height: "100%",
        textAlignVertical: "center",
        fontSize: 16,
    },
    spinnerContainer: {
        width: 80,
        height: 80,
        alignSelf: "center",
        position: "absolute",
        bottom: "20%",
    },
});
