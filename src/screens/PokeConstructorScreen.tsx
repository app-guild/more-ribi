import React, {Component} from "react";
import {Text, View} from "react-native";
import {globalStylesheet} from "../../resources/styles";

export interface IPokeConstructorScreenState {}

class PokeConstructorScreen extends Component<
    Readonly<any>,
    Readonly<IPokeConstructorScreenState>
> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={globalStylesheet.centerBody}>
                <Text>Poke Constructor Screen</Text>
            </View>
        );
    }
}

export default PokeConstructorScreen;
