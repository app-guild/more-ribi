import React, {Component} from "react";
import {ImageBackground, Text, View, ScrollView, Dimensions, StyleSheet, Image} from "react-native";
import {globalColors} from "../../resources/styles";
import {CheckBox} from "react-native-elements";

import {getStatusBarHeight} from "react-native-status-bar-height";
import PokeConstructorCard from "../components/PokeConstructorCard";

export interface IPokeConstructorScreenState {
    checked: boolean;
}

class PokeConstructorScreen extends Component<Readonly<any>, Readonly<IPokeConstructorScreenState>> {
    private readonly screenWidth = Dimensions.get("window").width;
    private readonly screenHeight = Dimensions.get("window").height - getStatusBarHeight();

    constructor(props: any) {
        super(props);
        this.state = {
            checked: false,
        };
    }

    render() {
        return (
            <View style={{height: this.screenHeight}}>
                <ScrollView>
                    <ImageBackground
                        style={{width: "auto"}}
                        source={require("../../resources/assets/drawable/food.jpg")}>
                        <Text style={stylesheet.topText}>Собери свой идеальный ПОКÉ БОУЛ</Text>
                    </ImageBackground>
                    <View style={{backgroundColor: "white"}}>
                        <Text style={stylesheet.titleText}>СОБРАТЬ ПОКÉ</Text>
                        <Text style={stylesheet.descriptionText}>
                            В поке-руме "Много Рыбы" вы сможете собрать своё блюдо сами, выбрав из нескольких основ,
                            протеинов и более 20-ти наполнителей и топингов. Сочетайте свинину в соусе терияки с
                            ананасом, острого тунца с манго или соберите вегетарианский боул с тофу и красной капустой.
                            Вы выбираете, а мы готовим для вас из самых свежих и качественных продуктов.
                        </Text>
                    </View>
                    <PokeConstructorCard
                        title={"Основа"}
                        number={1}
                        image={require("../../resources/assets/drawable/poke-constructor/1-image.webp")}
                        smallImage={require("../../resources/assets/drawable/poke-constructor/1.webp")}
                        choices={["рис", "киноа", "удон", "киноа+рис", "айсберг"]}
                    />
                    <PokeConstructorCard
                        title={"Протеин"}
                        number={2}
                        image={require("../../resources/assets/drawable/poke-constructor/2-image.webp")}
                        smallImage={require("../../resources/assets/drawable/poke-constructor/2.webp")}
                        choices={["тунец", "лосось", "курица", "свинина", "креветки", "тофу", "краб"]}
                    />
                    <PokeConstructorCard
                        title={"Наполнитель"}
                        number={3}
                        image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                        smallImage={require("../../resources/assets/drawable/poke-constructor/3.webp")}
                        choices={[
                            "морковь",
                            "битые огурцы",
                            "красная капуста",
                            "болгарский перец",
                            "cалат айсберг",
                            "корн салат",
                            "красный лук",
                            "томаты черри",
                            "редис",
                            "такуан",
                            "грибы",
                            "чука",
                            "кимчи",
                            "соевые ростки",
                            "баклажаны",
                        ]}
                    />
                </ScrollView>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    topText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 28,
        color: globalColors.whiteTextColor,
        paddingVertical: 40,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    titleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 24,
        color: globalColors.mainTextColor,
        paddingVertical: 14,
        textAlign: "center",
    },
    descriptionText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 13,
        color: globalColors.mainTextColor,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    number: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 60,
        lineHeight: 60,
        color: globalColors.mainTextColor,
    },
    subTitleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 23,
        lineHeight: 50,
        color: globalColors.mainTextColor,
        marginLeft: 12,
    },
    radioButtonText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 13,
        color: globalColors.mainTextColor,
    },
    odd: {
        color: "#779db9",
    },
    even: {
        color: "#ffc11e",
    },
});

export default PokeConstructorScreen;
