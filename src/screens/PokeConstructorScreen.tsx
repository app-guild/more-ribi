import React, {Component} from "react";
import {ImageBackground, Text, View, ScrollView, StyleSheet} from "react-native";
import {globalColors} from "../../resources/styles";
import PokeConstructorCard, {IPokeConstructorCardData} from "../components/PokeConstructorCard";
import CheckBoxGroup from "../components/СheckBoxGroup";

export interface IPokeConstructorScreenState {
    addIngredientOpen: boolean;
    toppingSwitch: 1 | 2;
    totalPrice: number;
}

const standardPrice = 270;

class PokeConstructorScreen extends Component<Readonly<any>, Readonly<IPokeConstructorScreenState>> {
    private data: IPokeConstructorCardData[];
    private additionalTitleText: string[] = ["", " (+30Р)", " (+30Р)", " (+15Р)", " (+30Р)"];
    private additionalSumByCategories: number[] = new Array(this.additionalTitleText.length).fill(0);
    private cardRefs: (PokeConstructorCard | null)[] = [];

    constructor(props: any) {
        super(props);
        this.state = {
            addIngredientOpen: false,
            toppingSwitch: 1,
            totalPrice: standardPrice,
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
                additionalText: ["(+100р)", "(+100р)", "(+60р)", "(+60р)", "(+120р)", "(+60р)", "(+60р)"],
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
        this.onAdditionalClick = this.onAdditionalClick.bind(this);
    }

    private onAdditionalClick(values: boolean[], changed: boolean, changedIndex: number, id: number) {
        if (changed) {
            let sum = 0;
            if (this.additionalTitleText[id] === "") {
                this.data[id + 1].additionalText?.forEach((val, index) => {
                    if (values[index]) {
                        sum += parseInt(val.slice(2, -2));
                    }
                });
                this.additionalSumByCategories[id] = sum;
            } else {
                values.forEach((val) => {
                    if (val) {
                        sum += parseInt(this.additionalTitleText[id].slice(2, -2));
                    }
                });
                this.additionalSumByCategories[id] = sum;
            }
            this.setState({
                totalPrice:
                    standardPrice + this.additionalSumByCategories.reduce((partial_sum, a) => partial_sum + a, 0),
            });
        }
    }

    render() {
        //console.log("RENDER: Screen");
        const cards1_2 = this.data.slice(0, 2).map((value, index) => (
            <PokeConstructorCard
                ref={(ref) => {
                    this.cardRefs[index] = ref;
                    return true;
                }}
                key={index}
                data={value}
            />
        ));
        const cards3_6 = this.data.slice(2, 6).map((value, index) => {
            if (index === 0) {
                value.choiceLimit = this.state.toppingSwitch === 1 ? 5 : 3;
            }
            if (index === 1) {
                value.choiceLimit = this.state.toppingSwitch;
            }
            return (
                <PokeConstructorCard
                    ref={(ref) => {
                        this.cardRefs[index + 2] = ref;
                        return true;
                    }}
                    key={index}
                    data={value}
                />
            );
        });
        const additionalIngredients = this.data.slice(1, 6).map((value, index) => (
            <View key={index}>
                <View style={{flexDirection: "row"}}>
                    <Text style={{...stylesheet.subTitleText, marginTop: 30, marginLeft: 10}}>{value.title}</Text>
                    {this.additionalTitleText[index] ? (
                        <Text style={{...stylesheet.additionalText, marginTop: 30}}>
                            {this.additionalTitleText[index]}
                        </Text>
                    ) : null}
                </View>
                <CheckBoxGroup
                    choices={value.choices}
                    choicesLocation={value.choicesLocation}
                    choiceType={value.choiceType}
                    additionalText={value.additionalText}
                    onClick={this.onAdditionalClick}
                    canUncheck={true}
                    id={index}
                />
            </View>
        ));
        return (
            <ImageBackground source={require("../../resources/assets/drawable/background.png")} style={{flex: 1}}>
                <View style={stylesheet.backgroundOverlay}>
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
                                    onTouchEnd={() => {
                                        if (this.state.toppingSwitch === 2) {
                                            this.cardRefs[2]?.setLimit(5);
                                            this.cardRefs[3]?.setLimit(1);
                                            this.setState({toppingSwitch: 1});
                                        }
                                    }}
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
                                    onTouchEnd={() => {
                                        if (this.state.toppingSwitch === 1) {
                                            this.cardRefs[2]?.setLimit(3);
                                            this.cardRefs[3]?.setLimit(2);
                                            this.setState({toppingSwitch: 2});
                                        }
                                    }}
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
                            <Text style={stylesheet.price}>{this.state.totalPrice + " руб"}</Text>
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
                            <View style={{alignItems: "center", alignSelf: "center", paddingBottom: 20, width: "65%"}}>
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
    additionalText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 20,
        lineHeight: 28,
        color: globalColors.additionalTextColor,
    },
});

export default PokeConstructorScreen;
