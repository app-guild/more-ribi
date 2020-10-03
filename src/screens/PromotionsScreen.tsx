import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";
import RNGooglePayButton from "react-native-gpay-button";

export interface IPromotionsScreenState {}

class PromotionsScreen extends Component<Readonly<any>, Readonly<IPromotionsScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <RNGooglePayButton style={{height: 200, width: 200}} />
            </View>
        );
    }
}

export default PromotionsScreen;
