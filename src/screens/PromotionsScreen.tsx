import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";

export interface IPromotionsScreenState {}

class PromotionsScreen extends Component<Readonly<any>, Readonly<IPromotionsScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Promotions Screen</Text>
            </View>
        );
    }
}

export default PromotionsScreen;
