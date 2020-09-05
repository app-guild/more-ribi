import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity} from "react-native";
import {globals, stylesheet} from "../../resources/styles";
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
        ...stylesheet.productCardContainer,
        ...style,
      }}>
        <Image
          source={require("../../resources/assets/drawable/food.jpg")}
          style={{
            width: width-2*stylesheet.productCardContainer.padding,
            height: (width-2*stylesheet.productCardContainer.padding)/1.2,
            borderRadius: 20,
          }}
        />
        <Text style={stylesheet.productCardName}>{name}</Text>
        <Text style={stylesheet.productCardComposition}>{composition}</Text>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <View>
            <Text style={stylesheet.productCardPrice}>{price}</Text>
            <Text style={stylesheet.productCardCrossedOutPrice}>{crossOutPrice}</Text>
          </View>
          <View style={stylesheet.productCardShoppingCartButtonContainer}>
            <CardIcon width={16} height={16} fill={globals.shoppingCartColor} style={{position: "absolute"}}/>
            <TouchableOpacity
              style={stylesheet.productCardShoppingCartButton}
              activeOpacity={0.5}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default ProductCard;
