import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface IAboutUsScreenState {}

class AboutUsScreen extends Component<
    Readonly<any>,
    Readonly<IAboutUsScreenState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.centerBody}>
                <Text>About Us Screen</Text>
            </View>
        );
    }
}

export default AboutUsScreen;
