import React, {Component} from "react";
import {Text, View, Dimensions, StyleSheet, Image} from "react-native";
import {globalColors} from "../../resources/styles";
import {CheckBox} from "react-native-elements";

export interface IPokeConstructorCardState {
    checked: boolean[];
}

export interface IPokeConstructorCardProps {
    title: string;
    image: string;
    smallImage: string;
    choices: string[];
}

class PokeConstructorCard extends Component<Readonly<any>, Readonly<IPokeConstructorCardState>> {
    private readonly screenWidth = Dimensions.get("window").width;

    constructor(props: IPokeConstructorCardProps) {
        super(props);
        this.state = {checked: new Array(props.choices.length).fill(false)};
    }

    render() {
        const {title, number, image, smallImage, choices} = this.props;
        const choicesList = choices.map((val: any, index: any) => (
            <View
                key={index}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                }}>
                <CheckBox
                    checked={this.state.checked[index]}
                    onPress={() =>
                        this.setState({
                            checked: this.state.checked.splice(index, 1, !this.state.checked[index]),
                        })
                    }
                    wrapperStyle={{paddingVertical: 10}}
                    containerStyle={{
                        padding: 0,
                        margin: 0,
                    }}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                />
                <Text style={stylesheet.radioButtonText}>{val}</Text>
            </View>
        ));
        return (
            <View style={{flexDirection: "row", justifyContent: "center", marginTop: 20}}>
                <View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "flex-end",
                            marginLeft: 20,
                        }}>
                        <Text style={{...stylesheet.number, ...stylesheet.odd}}>{number}</Text>
                        <Image
                            source={smallImage}
                            style={{
                                position: "absolute",
                                width: 30,
                                height: 30,
                                left: 15,
                            }}
                        />
                        <Text style={stylesheet.subTitleText}>{title}</Text>
                    </View>
                    <Image
                        source={image}
                        style={{
                            borderRadius: this.screenWidth / 8,
                            width: this.screenWidth / 2,
                            height: "auto",
                            aspectRatio: 1.5,
                        }}
                    />
                </View>
                <View style={{marginLeft: 20}}>{choicesList}</View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    topText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 28,
        color: globalColors.whiteTextColor,
        paddingVertical: 40,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    titleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 24,
        color: globalColors.mainTextColor,
        paddingVertical: 14,
        textAlign: "center",
    },
    descriptionText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 13,
        color: globalColors.mainTextColor,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    number: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 60,
        lineHeight: 60,
        color: globalColors.mainTextColor,
    },
    subTitleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 23,
        lineHeight: 50,
        color: globalColors.mainTextColor,
        marginLeft: 12,
    },
    radioButtonText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 13,
        color: globalColors.mainTextColor,
    },
    odd: {
        color: "#779db9",
    },
    even: {
        color: "#ffc11e",
    },
});

export default PokeConstructorCard;
