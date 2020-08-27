import React, {Component} from "react";
import {Text, View} from "react-native";
import {globals, stylesheet} from "../../resources/styles";
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
    console.log(this.props.route);
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
            <Text style={stylesheet.headerSubTitle}>{this.props.route?JSON.stringify(this.props.route.params.category):"Поке"}</Text>
            <FishIcon width={15} height={25}/>
          </View>
          <View style={stylesheet.headerCategoryUnderline}/>
        </View>

      </View>

    );
  }
}

export default Header;
