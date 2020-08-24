import React, {Component} from "react";
import {Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";

export interface IDeliveryConditionsScreenState {}

class DeliveryConditionsScreen extends Component<
  Readonly<any>,
  Readonly<IDeliveryConditionsScreenState>
  > {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={stylesheet.centerBody}>
        <Text>Delivery Conditions Screen</Text>
      </View>
    );
  }
}

export default DeliveryConditionsScreen;
