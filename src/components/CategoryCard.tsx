import React, {Component} from "react";
import {Image, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";


export interface ICategoryCardState {}
export interface ICategoryCardProps {
  size: number,
  name: string,
  image?: any,
  style?: any,
}

class CategoryCard extends Component<Readonly<ICategoryCardProps>, Readonly<ICategoryCardState>> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      size,
      name,
      image,
      style,
    } = this.props
    return (
      <View
        style={{
          width: size,
          ...stylesheet.categoriesScreenCard,
          ...style,
        }}
      >
        <Image
          source={require("../../resources/assets/drawable/food.jpg")}
          style={{
            width: size,
            height: size,
            borderRadius: stylesheet.categoriesScreenCard.borderRadius,
          }}
        />
        <View style={stylesheet.categoriesScreenCardTitleContainer}>
          <Text style={stylesheet.categoriesScreenCardTitle}>{name}</Text>
        </View>
      </View>
    );
  }
}

export default CategoryCard;
