import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface IMainScreenState {}

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.centerBody}>
                <Text>Main Screen</Text>
            </View>
        );
    }
}

export default MainScreen;
