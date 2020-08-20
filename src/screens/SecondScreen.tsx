import React, {Component} from "react";
import {Button, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface ISecondScreenState {}

class SecondScreen extends Component<
    Readonly<any>,
    Readonly<ISecondScreenState>
> {
    private readonly navigation: any = this.props.navigation;
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.centerBody}>
                <Text>Hello World!</Text>
                <Button
                    title={"Go Home screen"}
                    onPress={() => this.navigation.navigate("Main")}
                />
            </View>
        );
    }
}

export default SecondScreen;
