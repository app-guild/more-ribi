import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity} from "react-native";
import {stylesheet} from "../../resources/styles";
import Food from "../../resources/assets/drawable/food.jpg"
import CardIcon from "../../resources/assets/drawable/cart_icon.svg"

export interface IDishCardState {}
export interface IDishCardProps {
  width: number,
  name: string,
  composition: string,
  price: number,
  style?: any,
}

class DishCard extends Component<Readonly<IDishCardProps>, Readonly<IDishCardState>> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{
        width: this.props.width,
        ...stylesheet.dishCardContainer,
        ...this.props.style,
      }}>
        <Image
          // source={{
          //   uri: "https://online.moysklad.ru/api/remap/1.1/download/4f3d5d08-2b69-41e5-85a0-e50f20cae204",
          //   method: "GET",
          //   headers: {
          //     Authorization: "Basic YWRtaW5Ac3Rvcm1raXJpbGw5ODo2NjE3OGNmZTZj"
          //   },
          // }}
          source={require("../../resources/assets/drawable/food.jpg")}
          style={{
            width: this.props.width-2*stylesheet.dishCardContainer.padding,
            height: 110,
            backgroundColor: "blue",
            borderRadius: 20,
          }}
        />
        <Text style={stylesheet.dishCardName}>{this.props.name}</Text>
        <Text style={stylesheet.dishCardComposition}>{this.props.composition}</Text>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <Text style={stylesheet.dishCardPrice}>{this.props.price}</Text>
          <View style={stylesheet.dishCardShoppingCartButtonContainer}>
            <CardIcon width={16} height={16} fill={"#909090"} style={{position: "absolute"}}/>
            <TouchableOpacity
              style={stylesheet.dishCardShoppingCartButton}
              activeOpacity={0.5}
            />
          </View>

        </View>
      </View>
    );
  }
}

export default DishCard;
