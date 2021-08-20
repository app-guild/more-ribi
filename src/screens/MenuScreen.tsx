import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface IMenuScreenState {}

class MenuScreen extends Component<Readonly<any>, Readonly<IMenuScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.centerBody}>
                <Text>Menu Screen</Text>
            </View>
        );
    }
}

export default MenuScreen;
