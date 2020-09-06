import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {globals} from "../../resources/styles";
import MenuIcon from "./../../resources/assets/drawable/menu_icon.svg";
import CartIcon from "./../../resources/assets/drawable/cart_icon.svg";
import FishIcon from "./../../resources/assets/drawable/fish_icon2.svg";

export interface IHeaderState {}

class Header extends Component<any, Readonly<IHeaderState>> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={stylesheet.headerContainer}>
        <View style={stylesheet.headerSubContainer}>
          <View style={stylesheet.headerTopContainer}>
            <MenuIcon width={30} height={30} onTouchEnd={this.props.navigation.openDrawer}/>
            <Text style={stylesheet.headerTitle}>Много рыбы</Text>
          </View>
          <View style={stylesheet.headerTopContainer}>
            <CartIcon width={19} height={18} fill={globals.primaryColor}/>
            <Text style={stylesheet.headerPriceText}>500P</Text>
          </View>
        </View>

        <View style={{alignSelf: "flex-start"}}>
          <View
            style={stylesheet.headerCategoryButton}
            onTouchEnd={()=>this.props.navigation.navigate(("Categories"))}
          >
            <Text style={stylesheet.headerSubTitle}>{this.props.category}</Text>
            <FishIcon width={15} height={25}/>
          </View>
          <View style={stylesheet.headerCategoryUnderline}/>
        </View>
      </View>

    );
  }
}

export const stylesheet = StyleSheet.create({
  headerContainer: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    lineHeight: 29,
    color: globals.primaryColor,
    marginLeft: 9,
  },
  headerSubTitle: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 16,
    lineHeight: 20,
    color: globals.primaryColor,
    marginRight: 7,
  },
  headerTopContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerSubContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerPriceText: {
    fontFamily: "Muli",
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 14,
    lineHeight: 18,
    color: globals.primaryColor,
    marginLeft: 6,
  },
  headerCategoryButton: {
    flexDirection: "row",
    marginLeft: 40,
    marginTop: 10,
  },
  headerCategoryUnderline: {
    backgroundColor: globals.headerUnderlineColor,
    width: "auto",
    height: 2,
    marginLeft: 38,
    marginTop: 3
  },
})

export default Header;
