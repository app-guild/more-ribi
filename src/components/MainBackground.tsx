import React, {Component} from "react";
import {Dimensions, ImageBackground, StyleSheet, View} from "react-native";
import {globalColors} from "../../resources/styles";

const {height, width} = Dimensions.get("window");

class MainBackground extends Component<Readonly<any>, Readonly<any>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.background}>
                <ImageBackground
                    source={require("../../resources/assets/drawable/background.png")}
                    style={{height, width}}>
                    <View style={stylesheet.backgroundOverlay}>{this.props.children}</View>
                </ImageBackground>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    background: {
        height: "100%",
        width: "100%",
        backgroundColor: globalColors.mainBackgroundColor,
    },
    backgroundOverlay: {
        backgroundColor: globalColors.backgroundOverlay,
        flex: 1,
        opacity: 0.9,
    },
});

export default MainBackground;
