import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

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
      <View style={stylesheet.centerBody}>
        <Text>Restaurants Screen</Text>
      </View>
    );
  }
}

export default RestaurantsScreen;
