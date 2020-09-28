import React, {Component} from "react";
import {ImageBackground, StyleSheet, View} from "react-native";
import {globalColors} from "../../resources/styles";

class MainBackground extends Component<Readonly<any>, Readonly<any>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.background}>
                <ImageBackground source={require("../../resources/assets/drawable/background.png")} style={{flex: 1}}>
                    <View style={stylesheet.backgroundOverlay}>{this.props.children}</View>
                </ImageBackground>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: globalColors.mainBackgroundColor,
    },
    backgroundOverlay: {
        backgroundColor: globalColors.backgroundOverlay,
        flex: 1,
        opacity: 0.9,
    },
});

export default MainBackground;
