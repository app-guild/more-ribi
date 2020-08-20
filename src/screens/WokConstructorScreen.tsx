import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface IWokConstructorScreenState {}

class WokConstructorScreen extends Component<
    Readonly<any>,
    Readonly<IWokConstructorScreenState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.centerBody}>
                <Text>Wok Constructor Screen</Text>
            </View>
        );
    }
}

export default WokConstructorScreen;
