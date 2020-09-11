import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";

export interface IRestaurantsScreenState {}

class RestaurantsScreen extends Component<
    Readonly<any>,
    Readonly<IRestaurantsScreenState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Restaurants Screen</Text>
            </View>
        );
    }
}

export default RestaurantsScreen;
