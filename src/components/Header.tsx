import React, {Component} from "react";
import {Button, StyleSheet, Text, View} from "react-native";
import {globals} from "../../resources/styles";
import MenuIcon from "./../../resources/assets/drawable/menu_icon.svg";
import CartIcon from "./../../resources/assets/drawable/cart_icon.svg";
import FishIcon from "./../../resources/assets/drawable/fish_icon2.svg";
import FishBackButton from "./../../resources/assets/drawable/fish_back_button.svg";
import {DrawerNavigationProp} from "@react-navigation/drawer";

export interface IHeaderState {}
export interface IHeaderProps {
    needCategoryName: boolean;
    category: string;
    navigation: DrawerNavigationProp<any>;
    onFishButton: any;
}

class Header extends Component<Readonly<IHeaderProps>, Readonly<IHeaderState>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.subContainer}>
                    <View style={stylesheet.topContainer}>
                        <MenuIcon
                            width={30}
                            height={30}
                            onTouchEnd={this.props.navigation.openDrawer}
                        />
                        <Text style={stylesheet.title}>Много рыбы</Text>
                    </View>
                    <View style={stylesheet.topContainer}>
                        <CartIcon
                            width={19}
                            height={18}
                            fill={globals.primaryColor}
                        />
                        <Text numberOfLines={1} style={stylesheet.priceText}>
                            500P
                        </Text>
                    </View>
                </View>

                {this.props.needCategoryName ? (
                    <View style={{alignSelf: "flex-start"}}>
                        <View
                            style={stylesheet.categoryButton}
                            onTouchEnd={() =>
                                this.props.navigation.navigate("Categories")
                            }>
                            <Text style={stylesheet.subTitle}>
                                {this.props.category}
                            </Text>
                            <FishIcon width={15} height={25} />
                        </View>
                        <View style={stylesheet.categoryUnderline} />
                    </View>
                ) : (
                    <View
                        onTouchEnd={this.props.onFishButton}
                        style={stylesheet.fishBackButton}>
                        <FishBackButton width={47} heigth={17} />
                    </View>
                )}
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    title: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 24,
        lineHeight: 29,
        color: globals.primaryColor,
        marginLeft: 9,
    },
    subTitle: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 20,
        color: globals.primaryColor,
        marginRight: 7,
    },
    topContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    subContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    priceText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
        color: globals.primaryColor,
        marginLeft: 6,
    },
    categoryButton: {
        flexDirection: "row",
        marginLeft: 40,
        marginTop: 10,
    },
    categoryUnderline: {
        backgroundColor: globals.headerUnderlineColor,
        width: "auto",
        height: 2,
        marginLeft: 38,
        marginTop: 3,
    },
    fishBackButton: {
        marginLeft: 34,
        marginTop: 20,
    },
});

export default Header;
