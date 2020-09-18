import React, {Component} from "react";
import {ImageBackground, Text, View, ScrollView, Dimensions, StyleSheet} from "react-native";
import {globalColors} from "../../resources/styles";

import {getStatusBarHeight} from "react-native-status-bar-height";
import PokeConstructorCard from "../components/PokeConstructorCard";
// import {stylesheet} from "./MainScreen";

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
            <ImageBackground source={require("../../resources/assets/drawable/background.png")} style={{flex: 1}}>
                <View style={{...stylesheet.backgroundOverlay, height: this.screenHeight}}>
                    <ScrollView>
                        <ImageBackground
                            style={{width: "auto"}}
                            source={require("../../resources/assets/drawable/food.jpg")}>
                            <Text style={stylesheet.topText}>Собери свой идеальный ПОКÉ БОУЛ</Text>
                        </ImageBackground>
                        <View>
                            <Text style={stylesheet.titleText}>СОБРАТЬ ПОКÉ</Text>
                            <Text style={stylesheet.descriptionText}>
                                В поке-руме "Много Рыбы" вы сможете собрать своё блюдо сами, выбрав из нескольких основ,
                                протеинов и более 20-ти наполнителей и топингов. Сочетайте свинину в соусе терияки с
                                ананасом, острого тунца с манго или соберите вегетарианский боул с тофу и красной
                                капустой. Вы выбираете, а мы готовим для вас из самых свежих и качественных продуктов.
                            </Text>
                        </View>
                        <PokeConstructorCard
                            title={"Основа"}
                            number={1}
                            image={require("../../resources/assets/drawable/poke-constructor/1-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/1.webp")}
                            choices={["рис", "киноа", "удон", "киноа+рис", "айсберг"]}
                            choiceType={"radioButton"}
                            choicesLocation={"left"}
                        />
                        <PokeConstructorCard
                            title={"Протеин"}
                            number={2}
                            image={require("../../resources/assets/drawable/poke-constructor/2-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/2.webp")}
                            choices={["тунец", "лосось", "курица", "свинина", "креветки", "тофу", "краб"]}
                            choiceType={"radioButton"}
                            choicesLocation={"left"}
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
                            choiceType={"checkBox"}
                            choicesLocation={"bottom"}
                        />
                        <PokeConstructorCard
                            title={"Топпинг"}
                            number={4}
                            image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/3.webp")}
                            choices={["авокадо", "манго", "ананас", "масаго", "бобы эдамамэ"]}
                            choiceType={"checkBox"}
                            choicesLocation={"left"}
                        />
                        <PokeConstructorCard
                            title={"Соус"}
                            number={5}
                            image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/3.webp")}
                            choices={["терияки", "васаби", "японский", "гавайский", "спайс"]}
                            choiceType={"radioButton"}
                            choicesLocation={"left"}
                        />
                        <PokeConstructorCard
                            title={"Хруст"}
                            number={6}
                            image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/3.webp")}
                            choices={[
                                "кешью",
                                "кунжут",
                                "ким нори",
                                "жареный лук",
                                "миндальные лепестки",
                                "начос",
                                "тыквенные семечки",
                            ]}
                            choiceType={"radioButton"}
                            choicesLocation={"left"}
                        />
                    </ScrollView>
                </View>
            </ImageBackground>
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
    backgroundOverlay: {
        backgroundColor: globalColors.backgroundOverlay,
        flex: 1,
        opacity: 0.95,
    },
});

export default PokeConstructorScreen;
