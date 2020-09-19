import React, {Component} from "react";
import {ImageBackground, Text, View, ScrollView, Dimensions, StyleSheet} from "react-native";
import {globalColors} from "../../resources/styles";
import {getStatusBarHeight} from "react-native-status-bar-height";
import PokeConstructorCard, {IPokeConstructorCardData} from "../components/PokeConstructorCard";
import CheckBoxSelect from "../components/СheckBoxSelect";

export interface IPokeConstructorScreenState {
    checked: boolean;
    addIngredientOpen: boolean;
    toppingSwitch: 1 | 2;
}

class PokeConstructorScreen extends Component<Readonly<any>, Readonly<IPokeConstructorScreenState>> {
    private readonly screenHeight = Dimensions.get("window").height - getStatusBarHeight();
    private data: IPokeConstructorCardData[];

    constructor(props: any) {
        super(props);
        this.state = {
            checked: false,
            addIngredientOpen: false,
            toppingSwitch: 1,
        };
        this.data = [
            {
                title: "Основа",
                choices: ["рис", "киноа", "удон", "киноа+рис", "айсберг"],
                number: 1,
                image: require("../../resources/assets/drawable/poke-constructor/1-image.jpg"),
                smallImage: require("../../resources/assets/drawable/poke-constructor/1.webp"),
                choiceType: "radioButton",
                choicesLocation: "left",
            },
            {
                title: "Протеин",
                choices: ["тунец", "лосось", "курица", "свинина", "креветки", "тофу", "краб"],
                number: 2,
                image: require("../../resources/assets/drawable/poke-constructor/2-image.jpg"),
                smallImage: require("../../resources/assets/drawable/poke-constructor/2.webp"),
                choiceType: "radioButton",
                choicesLocation: "left",
            },
            {
                title: "Наполнитель",
                choices: [
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
                ],
                number: 3,
                image: require("../../resources/assets/drawable/poke-constructor/3-image.jpg"),
                smallImage: require("../../resources/assets/drawable/poke-constructor/3.webp"),
                choiceType: "checkBox",
                choicesLocation: "bottom",
            },
            {
                title: "Топпинг",
                choices: ["авокадо", "манго", "ананас", "масаго", "бобы эдамамэ"],
                number: 4,
                image: require("../../resources/assets/drawable/poke-constructor/3-image.jpg"),
                smallImage: require("../../resources/assets/drawable/poke-constructor/4.webp"),
                choiceType: "checkBox",
                choicesLocation: "left",
            },
            {
                title: "Соус",
                choices: ["терияки", "васаби", "японский", "гавайский", "спайс"],
                number: 5,
                image: require("../../resources/assets/drawable/poke-constructor/3-image.jpg"),
                smallImage: require("../../resources/assets/drawable/poke-constructor/5.webp"),
                choiceType: "radioButton",
                choicesLocation: "left",
            },
            {
                title: "Хруст",
                choices: [
                    "кешью",
                    "кунжут",
                    "ким нори",
                    "жареный лук",
                    "миндальные лепестки",
                    "начос",
                    "тыквенные семечки",
                ],
                number: 6,
                image: require("../../resources/assets/drawable/poke-constructor/3-image.jpg"),
                smallImage: require("../../resources/assets/drawable/poke-constructor/6.webp"),
                choiceType: "radioButton",
                choicesLocation: "left",
            },
        ];
    }

    render() {
        const cards1_2 = this.data.slice(0, 2).map((value, index) => <PokeConstructorCard key={index} data={value} />);
        const cards3_6 = this.data.slice(2, 6).map((value, index) => {
            if (index === 0) value.choiceLimit = this.state.toppingSwitch === 1 ? 5 : 3;
            if (index === 1) value.choiceLimit = this.state.toppingSwitch;
            return <PokeConstructorCard key={index} data={value} />;
        });
        const additionalIngredients = this.data.slice(1, 6).map((value, index) => (
            <View key={index}>
                <Text style={stylesheet.subTitleText}>{value.title}</Text>
                <CheckBoxSelect
                    choices={value.choices}
                    choicesLocation={value.choicesLocation}
                    choiceType={value.choiceType}
                />
            </View>
        ));
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
                        {cards1_2}
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
                                    onTouchEnd={() => this.setState({toppingSwitch: 1})}
                                    style={{
                                        ...stylesheet.toggleButton,
                                        flex: 1,
                                        backgroundColor:
                                            this.state.toppingSwitch === 1 ? globalColors.primaryColor : "transparent",
                                    }}>
                                    <Text style={{textAlign: "center"}}>5 наполнителей, 1 топпинг</Text>
                                </View>
                                <Text style={stylesheet.orText}>или</Text>
                                <View
                                    onTouchEnd={() => this.setState({toppingSwitch: 2})}
                                    style={{
                                        ...stylesheet.toggleButton,
                                        flex: 1,
                                        backgroundColor:
                                            this.state.toppingSwitch === 2 ? globalColors.primaryColor : "transparent",
                                    }}>
                                    <Text style={{textAlign: "center"}}>3 наполнителя, 2 топпинга</Text>
                                </View>
                            </View>
                        </View>
                        {cards3_6}
                        <View style={stylesheet.done}>
                            <Text style={stylesheet.doneText}>ГОТОВО!</Text>
                            <Text style={{...stylesheet.subTitleText, fontSize: 18}}>ВЫ СОБРАЛИ ИДЕАЛЬНЫЙ ПОКЕ!</Text>
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
                            <View style={{alignItems: "center", alignSelf: "center", paddingBottom: 20, width: "70%"}}>
                                <Text style={{...stylesheet.subTitleText, paddingVertical: 30}}>Дополнительно</Text>
                                {additionalIngredients}
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
        fontSize: 23,
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
        paddingHorizontal: 10,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: globalColors.orangeColor,
    },
    orText: {
        paddingHorizontal: 10,
    },
});

export default PokeConstructorScreen;
