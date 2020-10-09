import React, {Component} from "react";
import {Image, StyleSheet, Text, View} from "react-native";
import {globalColors} from "../../resources/styles";

const aboutUsText =
    "Здоровый и вкусный завтрак, быстрый обед или ужин со свежими и экзотическими ароматами. В " +
    '"Много Рыбы" у нас есть все! Ознакомьтесь с нашим меню, разработанным искусными шеф-поварами с использованием ' +
    "настоящих сезонных ингредиентов, и полюбите вкуснейший Poke Bowl. Либо выберите одно из наших фирменных блюд, " +
    "либо создайте свой идеальный Poke!";

class AboutUsScreen extends Component<Readonly<any>, Readonly<any>> {
    constructor(props: any) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <Image
                    style={{width: "100%", flex: 1}}
                    source={require("../../resources/assets/drawable/categories/poke-category.jpg")}
                />
                <View style={stylesheet.subContainer}>
                    <Text style={{...stylesheet.text, ...stylesheet.title}}>О "Море рыбы"</Text>
                    <View style={stylesheet.separator} />
                    <Text style={stylesheet.text}>{aboutUsText}</Text>
                </View>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        paddingHorizontal: 25,
        paddingBottom: 25,
    },
    subContainer: {
        backgroundColor: globalColors.aboutUsBackground,
        paddingVertical: 31,
        paddingHorizontal: 25,
        marginTop: 25,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: "15%",
        backgroundColor: globalColors.whiteTextColor,
    },
    text: {
        fontFamily: "Mulish-Light",
        fontSize: 12,
        fontWeight: "300",
        color: globalColors.whiteTextColor,
    },
    title: {
        fontFamily: "Montserrat-Black",
        fontSize: 24,
    },
});

export default AboutUsScreen;
