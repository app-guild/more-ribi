import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globals, globalStylesheet} from "../../resources/styles";
import CardIcon from "../../resources/assets/drawable/cart_icon.svg"

export interface IProductCardState {}
export interface IProductCardProps {
  width: number,
  name: string,
  composition: string,
  price: number,
  crossOutPrice?: number,
  image?: any,
  style?: any,
}

class ProductCard extends Component<Readonly<IProductCardProps>, Readonly<IProductCardState>> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      width,
      name,
      composition,
      price,
      crossOutPrice,
      image,
      style,
    } = this.props

    return (
      <View style={{
        width: width,
        ...stylesheet.container,
        ...style,
      }}>
        <Image
          source={require("../../resources/assets/drawable/food.jpg")}
          style={{
            width: width-2*stylesheet.container.padding,
            height: (width-2*stylesheet.container.padding)/1.2,
            borderRadius: 20,
          }}
        />
        <Text style={globalStylesheet.primaryText}>{name}</Text>
        <Text style={globalStylesheet.secondaryText}>{composition}</Text>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <View>
            <Text style={globalStylesheet.price}>{price}</Text>
            <Text style={globalStylesheet.crossedOutPrice}>{crossOutPrice}</Text>
          </View>
          <View style={stylesheet.shoppingCartButtonContainer}>
            <CardIcon width={16} height={16} fill={globals.shoppingCartColor} style={{position: "absolute"}}/>
            <TouchableOpacity
              style={stylesheet.shoppingCartButton}
              activeOpacity={0.5}
            />
          </View>
        </View>
      </View>
    );
  }
}

export const stylesheet = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 10,
    backgroundColor: globals.cardBackgroundColor,

    shadowColor: globals.shadowColor,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,
    elevation: 2,
  },
  shoppingCartButton:{
    borderRadius: 50,
    backgroundColor: globals.shadowColor,
    width: 30,
    height: 30,
    opacity: 0.2
  },
  shoppingCartButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
})

export default ProductCard;
