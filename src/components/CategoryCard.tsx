import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {globals, globalStylesheet} from "../../resources/styles";


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
          ...stylesheet.card,
          ...style,
        }}
        onTouchEnd={onTouchEnd}
      >
        <Image
          source={require("../../resources/assets/drawable/food.jpg")}
          style={{
            width: size,
            height: size,
            borderRadius: stylesheet.card.borderRadius,
          }}
        />
        <View style={stylesheet.cardTitleContainer}>
          <Text style={stylesheet.cardTitle}>{text}</Text>
        </View>
      </View>
    );
  }
}

export const stylesheet = StyleSheet.create({
  card: {
    borderRadius: 10,
  },
  cardTitleContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: globals.categoriesScreenCardTitleContainerBGColor,
    alignItems: "center",
    paddingVertical: 6,
    top: "60%",
  },
  cardTitle: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 17,
    color: globals.categoryCardTextColor,
  },
})

export default CategoryCard;
