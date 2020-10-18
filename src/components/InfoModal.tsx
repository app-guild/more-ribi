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

interface IState {
    type: InfoModalType;
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

export default class InfoModal extends Component<any, Readonly<IState>> {
    public static PRODUCTS_IN_CART_UNAVAILABLE_PATTERN =
        "К сожалению некоторые товары которые вы добавили в корзину теперь не доступны: ";
    public static SUCCESSFUL_SEND_ORDER_PATTERN =
        "Ваш заказ был успешно отправлен. В течение пяти минут с вами свяжется менеждер для подтверждения заказа.";
    public static FAILED_SEND_ORDER_PATTERN =
        "Не удалось сделать заказ. Пожалуйста, проверьте соединение с интернетом.";
    public static SUCCESSFUL_SEND_FEEDBACK_PATTERN = "Спасибо за ваш отзыв.";
    public static FAILED_SEND_FEEDBACK_PATTERN =
        "Не удалось отправить отзыв. Пожалуйста, проверьте соединение с интернетом.";

    private onPressOkCallback: ((type: InfoType | undefined) => void) | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            type: InfoModalType.INFO,
            modalVisible: false,
            infoType: InfoType.Info,
        };
        this.showInfo = this.showInfo.bind(this);
        this.startLoadAnimation = this.startLoadAnimation.bind(this);
        this.endLoadAnimation = this.endLoadAnimation.bind(this);
    }

    showInfo(text: string, header?: string): void {
        this.setState({type: InfoModalType.INFO, modalVisible: true, text, header, infoType: InfoType.Info});
    }

    startLoadAnimation(): void {
        this.setState({type: InfoModalType.LOADING, modalVisible: true, loadingState: LoadingState.Loading});
    }

    endLoadAnimation(
        success: boolean,
        onPressOkCallback: (type: InfoType | undefined) => void,
        text: string,
        header?: string,
    ): void {
        this.onPressOkCallback = onPressOkCallback;

        this.setState({
            loadingState: success ? LoadingState.Success : LoadingState.Failure,
            infoType: success ? InfoType.Success : InfoType.Failure,
            text,
            header,
        });
    }

    private _hideModal = () => {
        this.setState({modalVisible: false});
    };

    private _onPressOk = () => {
        this._hideModal();
        if (this.onPressOkCallback) {
            this.onPressOkCallback(this.state.infoType);
        }
    };

    render() {
        return (
            <Modal
                isVisible={this.state.modalVisible}
                animationIn={"pulse"}
                animationOut={"pulse"}
                onBackdropPress={this._onPressOk}
                onBackButtonPress={this._onPressOk}>
                {this.state.type === InfoModalType.LOADING && this.state.loadingState === LoadingState.Loading ? (
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
