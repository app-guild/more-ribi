import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";

export interface IMyOrdersScreenState {}

class MyOrdersScreen extends Component<
    Readonly<any>,
    Readonly<IMyOrdersScreenState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>My Orders Screen</Text>
            </View>
        );
    }
}

export default MyOrdersScreen;
