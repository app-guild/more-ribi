import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";

export interface IFeedbackScreenState {}

class FeedbackScreen extends Component<Readonly<any>, Readonly<IFeedbackScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Feedback Screen</Text>
            </View>
        );
    }
}

export default FeedbackScreen;
