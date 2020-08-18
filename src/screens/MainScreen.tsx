import React, {Component} from "react";
import {Button, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface IMainScreenState {}

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {
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
                    title={"Second screen"}
                    onPress={() => this.navigation.navigate("Second")}
                />
            </View>
        );
    }
}

export default MainScreen;
