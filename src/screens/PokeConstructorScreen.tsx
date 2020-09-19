import React, {Component} from "react";
import {ImageBackground, Text, View, ScrollView, Dimensions, StyleSheet, TouchableOpacity} from "react-native";
import {globalColors} from "../../resources/styles";

import {getStatusBarHeight} from "react-native-status-bar-height";
import PokeConstructorCard from "../components/PokeConstructorCard";
// import {stylesheet} from "./MainScreen";

export interface IPokeConstructorScreenState {
    checked: boolean;
    addIngredientOpen: boolean;
    toppingSwitch: 1 | 2;
}

class PokeConstructorScreen extends Component<Readonly<any>, Readonly<IPokeConstructorScreenState>> {
    private readonly screenWidth = Dimensions.get("window").width;
    private readonly screenHeight = Dimensions.get("window").height - getStatusBarHeight();

    constructor(props: any) {
        super(props);
        this.state = {
            checked: false,
            addIngredientOpen: false,
            toppingSwitch: 1,
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
                        <View
                            style={{
                                alignItems: "center",
                                paddingHorizontal: stylesheet.container.paddingHorizontal,
                                marginTop: 40,
                            }}>
                            <Text style={{marginBottom: 20}}>Выполняем наполнители и топпинг</Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    width: "100%",
                                }}>
                                <View
                                    onTouchEnd={(event) => this.setState({toppingSwitch: 1})}
                                    style={{
                                        ...stylesheet.toggleButton,
                                        width:
                                            (this.screenWidth - stylesheet.container.paddingHorizontal) / 2 -
                                            stylesheet.orText.paddingHorizontal,
                                        backgroundColor:
                                            this.state.toppingSwitch === 1 ? globalColors.primaryColor : "transparent",
                                    }}>
                                    <Text style={{textAlign: "center"}}>5 наполнителей, 1 топпинг</Text>
                                </View>
                                <Text>или</Text>
                                <View
                                    onTouchEnd={(event) => this.setState({toppingSwitch: 2})}
                                    style={{
                                        ...stylesheet.toggleButton,
                                        width:
                                            (this.screenWidth - stylesheet.container.paddingHorizontal) / 2 -
                                            stylesheet.orText.paddingHorizontal,
                                        backgroundColor:
                                            this.state.toppingSwitch === 2 ? globalColors.primaryColor : "transparent",
                                    }}>
                                    <Text style={{textAlign: "center"}}>3 наполнителя, 2 топпинга</Text>
                                </View>
                            </View>
                        </View>
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
                            choiceLimit={this.state.toppingSwitch === 1 ? 5 : 3}
                        />
                        <PokeConstructorCard
                            title={"Топпинг"}
                            number={4}
                            image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/4.webp")}
                            choices={["авокадо", "манго", "ананас", "масаго", "бобы эдамамэ"]}
                            choiceType={"checkBox"}
                            choicesLocation={"left"}
                            choiceLimit={this.state.toppingSwitch}
                        />
                        <PokeConstructorCard
                            title={"Соус"}
                            number={5}
                            image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/5.webp")}
                            choices={["терияки", "васаби", "японский", "гавайский", "спайс"]}
                            choiceType={"radioButton"}
                            choicesLocation={"left"}
                        />
                        <PokeConstructorCard
                            title={"Хруст"}
                            number={6}
                            image={require("../../resources/assets/drawable/poke-constructor/3-image.webp")}
                            smallImage={require("../../resources/assets/drawable/poke-constructor/6.webp")}
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
                        <View style={stylesheet.done}>
                            <Text style={stylesheet.doneText}>ГОТОВО!</Text>
                            <Text style={stylesheet.subTitleText}>ВЫ СОБРАЛИ ИДЕАЛЬНЫЙ ПОКЕ!</Text>
                            <Text style={stylesheet.price}>1235 руб</Text>
                            <View style={stylesheet.buyButton}>
                                <Text style={stylesheet.buyText}>ЗАКАЗАТЬ</Text>
                            </View>
                            <Text
                                onPress={() => this.setState({addIngredientOpen: !this.state.addIngredientOpen})}
                                style={stylesheet.addIngredientText}>
                                {this.state.addIngredientOpen
                                    ? "*Цена основного поке зависит от максимальной стоимости протеина"
                                    : "Добавить ингридиент в поке"}
                            </Text>
                        </View>
                        {this.state.addIngredientOpen ? (
                            <View>
                                <Text>Дополнительно</Text>
                            </View>
                        ) : null}
                    </ScrollView>
                </View>
            </ImageBackground>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
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
        fontSize: 18,
        color: globalColors.mainTextColor,
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
    doneText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 30,
        lineHeight: 46,
        color: globalColors.primaryColor,
    },
    buyButton: {
        paddingHorizontal: 60,
        paddingVertical: 20,
        borderRadius: 28,
        marginTop: 20,
        backgroundColor: globalColors.orangeColor,
    },
    buyText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontSize: 19,
        color: globalColors.whiteTextColor,
    },
    done: {
        alignItems: "center",
        marginTop: 40,
    },
    price: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 30,
    },
    addIngredientText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 20,
        marginTop: 40,
        marginBottom: 40,
        textAlign: "center",
        color: globalColors.orangeColor,
    },
    toggleButton: {
        paddingVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: globalColors.orangeColor,
    },
    orText: {
        paddingHorizontal: 35,
    },
});

export default PokeConstructorScreen;
