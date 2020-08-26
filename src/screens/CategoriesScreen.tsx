import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface ICategoriesScreenState {}

class CategoriesScreen extends Component<Readonly<any>, Readonly<ICategoriesScreenState>> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={stylesheet.centerBody}>
        <Text>Categories Screen</Text>
      </View>
    );
  }
}

export default CategoriesScreen;
