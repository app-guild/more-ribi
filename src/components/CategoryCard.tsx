import React, {Component} from "react";
import {Image, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";


export interface ICategoryCardState {}
export interface ICategoryCardProps {
  size: number,
  text: string,
  onTouchEnd: any,
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
      text,
      onTouchEnd,
      image,
      style
    } = this.props
    return (
      <View
        style={{
          width: size,
          ...stylesheet.categoriesScreenCard,
          ...style,
        }}
        onTouchEnd={onTouchEnd}
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
          <Text style={stylesheet.categoriesScreenCardTitle}>{text}</Text>
        </View>
      </View>
    );
  }
}

export default CategoryCard;
