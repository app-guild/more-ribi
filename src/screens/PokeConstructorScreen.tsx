import React, {Component, createRef} from "react";
import {ImageBackground, Text, View, ScrollView, StyleSheet, Dimensions} from "react-native";
import {globalColors} from "../../resources/styles";
import PokeConstructorCard, {ChoicesLocation, ChoiceType} from "../components/PokeConstructorCard";
import CheckBoxGroup from "../components/СheckBoxGroup";
import {Tooltip} from "react-native-elements";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Ingredient from "../entities/Ingredient";
import {PokeIngredients} from "../entities/PokeIngredients";
import RadioButtonGroup from "../components/RadioButtonGroup";
import DatabaseApi from "../utils/database/DatabaseApi";
import {ProductType} from "../entities/ProductType";
import Product from "../entities/Product";

export interface IPokeConstructorScreenState {
    addIngredientOpen: boolean;
    toppingSwitch: 1 | 2;
    totalPrice: number;
    canDeployIngredientsPopover: boolean;
    isIngredientsPopoverDeployed: boolean;
    data: Map<string, Ingredient[]>;
    selectedIngredients: string;
    isLoaded: boolean;
}

export enum AdditionalTextType {
    AllChoices = "allChoices",
    OnlyTitle = "onlyTitle",
}

const staticData = [
    {
        title: PokeIngredients.Base,
        imageSource: require("../../resources/assets/drawable/poke-constructor/1-image.jpg"),
        iconSource: require("../../resources/assets/drawable/poke-constructor/1.webp"),
        choiceType: ChoiceType.RadioButton,
        choicesLocation: ChoicesLocation.Right,
    },
    {
        title: PokeIngredients.Protein,
        imageSource: require("../../resources/assets/drawable/poke-constructor/2-image.jpg"),
        iconSource: require("../../resources/assets/drawable/poke-constructor/2.webp"),
        choiceType: ChoiceType.RadioButton,
        choicesLocation: ChoicesLocation.Right,
        additionalTextType: AdditionalTextType.AllChoices,
    },
    {
        title: PokeIngredients.Filler,
        imageSource: require("../../resources/assets/drawable/poke-constructor/1-image.jpg"),
        iconSource: require("../../resources/assets/drawable/poke-constructor/3.webp"),
        choiceType: ChoiceType.CheckBox,
        choicesLocation: ChoicesLocation.Bottom,
        choiceLimit: 5,
        additionalTextType: AdditionalTextType.OnlyTitle,
    },
    {
        title: PokeIngredients.Topping,
        imageSource: require("../../resources/assets/drawable/poke-constructor/2-image.jpg"),
        iconSource: require("../../resources/assets/drawable/poke-constructor/4.webp"),
        choiceType: ChoiceType.CheckBox,
        choicesLocation: ChoicesLocation.Right,
        choiceLimit: 1,
        additionalTextType: AdditionalTextType.OnlyTitle,
    },
    {
        title: PokeIngredients.Sauce,
        iconSource: require("../../resources/assets/drawable/poke-constructor/5.webp"),
        choiceType: ChoiceType.RadioButton,
        choicesLocation: ChoicesLocation.Bottom,
        additionalTextType: AdditionalTextType.OnlyTitle,
    },
    {
        title: PokeIngredients.Crunch,
        iconSource: require("../../resources/assets/drawable/poke-constructor/6.webp"),
        choiceType: ChoiceType.RadioButton,
        choicesLocation: ChoicesLocation.Bottom,
        additionalTextType: AdditionalTextType.OnlyTitle,
    },
];

class PokeConstructorScreen extends Component<Readonly<any>, Readonly<IPokeConstructorScreenState>> {
    private cardRefs: (PokeConstructorCard | null)[] = [];
    private additionalIngredientsRefs: (CheckBoxGroup | RadioButtonGroup | null)[] = [];
    private scrollViewRef = createRef<ScrollView>();
    private needToScroll: boolean = true;

    constructor(props: any) {
        super(props);
        this.state = {
            addIngredientOpen: false,
            toppingSwitch: 1,
            totalPrice: 0,
            canDeployIngredientsPopover: false,
            isIngredientsPopoverDeployed: false,
            data: new Map(),
            selectedIngredients: "",
            isLoaded: false,
        };
        this.onCardClick = this.onCardClick.bind(this);
    }

    componentDidMount() {
        return RealtimeDatabaseApi.getPokeConstructorIngredients().then((ingredients) => {
            const protein = ingredients.get(PokeIngredients.Protein);
            const proteinPrice = protein ? protein[0].mainPrice : 0;
            this.setState({
                data: ingredients,
                selectedIngredients: this.initSelectedIngredients(ingredients),
                totalPrice: proteinPrice ? proteinPrice : 0,
                isLoaded: true,
            });
        });
    }

    private initSelectedIngredients(ingredients: Map<string, Ingredient[]>): string {
        let result = "Состав: ";
        let current;
        staticData.forEach((value) => {
            if (value.choiceType === ChoiceType.RadioButton) {
                current = ingredients.get(value.title);
                if (current) {
                    result = result.concat(current[0].name, ", ");
                }
            }
        });
        return result.slice(0, -2);
    }

    private onCardClick(changed: boolean) {
        if (changed) {
            const main = this.getCurrentIngredients(this.cardRefs);
            const additional = this.getCurrentIngredients(this.additionalIngredientsRefs);
            this.setState({
                selectedIngredients: "Состав: " + main + (additional.length ? "\nДополнительно: " + additional : ""),
                totalPrice: this.getTotalPrice(),
            });
        }
    }

    private getCards(start: number, end: number, lastInit?: boolean): JSX.Element[] {
        end = end < 0 ? this.state.data.size + end : end;
        const result = [...this.state.data]
            .sort((a, b) => {
                return PokeIngredients.sort(PokeIngredients.parse(a[0]), PokeIngredients.parse(b[0]));
            })
            .slice(start, end + 1)
            .map((value, index) => {
                const i = start + index;
                return (
                    <PokeConstructorCard
                        ref={(ref) => {
                            this.cardRefs[i] = ref;
                            return true;
                        }}
                        key={start + i}
                        data={{
                            title: PokeIngredients.translateCategoryName(PokeIngredients.parse(value[0])),
                            number: i + 1,
                            image: staticData[i].imageSource,
                            smallImage: staticData[i].iconSource,
                            ingredients: value[1],
                            choiceType: staticData[i].choiceType,
                            choicesLocation: staticData[i].choicesLocation,
                            choiceLimit: staticData[i].choiceLimit,
                            onClick: this.onCardClick,
                        }}
                    />
                );
            });
        return result;
    }

    private getAdditionalCards(start: number, end?: number): JSX.Element[] {
        return [...this.state.data]
            .sort((a, b) => {
                return PokeIngredients.sort(PokeIngredients.parse(a[0]), PokeIngredients.parse(b[0]));
            })
            .slice(start, end)
            .map((value, index) => {
                const i = index + start;
                return (
                    <View key={index} style={{width: stylesheet.addIngredientsContainer.width}}>
                        <View style={{flexDirection: "row"}}>
                            <Text style={{...stylesheet.subTitleText, marginTop: 30, marginLeft: 10}}>
                                {PokeIngredients.translateCategoryName(PokeIngredients.parse(value[0]))}
                            </Text>
                            {staticData[i].additionalTextType === AdditionalTextType.OnlyTitle ? (
                                <Text style={{...stylesheet.additionalText, marginTop: 30}}>
                                    {" (+" + value[1][0].additionalPrice + "₽)"}
                                </Text>
                            ) : null}
                        </View>

                        {staticData[i].choiceType === ChoiceType.CheckBox ? (
                            <CheckBoxGroup
                                ref={(ref) => {
                                    this.additionalIngredientsRefs[i] = ref;
                                    return true;
                                }}
                                choices={value[1]}
                                needAdditionalText={staticData[i].additionalTextType === AdditionalTextType.AllChoices}
                                onClick={this.onCardClick}
                            />
                        ) : (
                            <RadioButtonGroup
                                ref={(ref) => {
                                    this.additionalIngredientsRefs[i] = ref;
                                    return true;
                                }}
                                choices={value[1]}
                                needAdditionalText={staticData[i].additionalTextType === AdditionalTextType.AllChoices}
                                canUncheck={true}
                                onClick={this.onCardClick}
                            />
                        )}
                    </View>
                );
            });
    }

    private getTotalPrice(): number {
        const proteinIndex = this.cardRefs[1] ? this.cardRefs[1].getCheckedIndexes()[0] : 0;
        const proteinIngredients = this.state.data.get(staticData[1].title);
        const proteinPrice = proteinIngredients ? proteinIngredients[proteinIndex].mainPrice : 0;

        let price: number = proteinPrice ? proteinPrice : 0;
        let currentIngredients;
        let currentPrice;

        this.additionalIngredientsRefs.forEach((value, index) => {
            if (value) {
                value.getCheckedIndexes().forEach((value1) => {
                    currentIngredients = this.state.data.get(staticData[index].title);
                    currentPrice = currentIngredients ? currentIngredients[value1].additionalPrice : 0;
                    price += currentPrice ? currentPrice : 0;
                });
            }
        });
        return price;
    }

    private getCurrentIngredients(
        currentRefs: (PokeConstructorCard | CheckBoxGroup | RadioButtonGroup | null)[],
    ): string {
        let currentIngredients: string = "";
        currentRefs.forEach((value) => {
            if (value) {
                const currentString = value.getCheckedText().toString();
                if (currentString !== "") {
                    currentIngredients = currentIngredients.concat(currentString + ", ");
                }
            }
        });
        return currentIngredients.slice(0, -2);
    }

    private async addToCart(ingredients: string, price: number, image: string) {
        DatabaseApi.getCart().then((cart) => {
            const productIndex = cart.products.findIndex((value1) => value1.composition === ingredients);
            const cartCount = cart.products.length;
            if (productIndex === -1) {
                return DatabaseApi.addProductToCart(
                    new Product(
                        "Идеальный поке" + (cartCount === 0 ? "" : " №" + (cartCount + 1)),
                        ProductType.CustomPoke,
                        price,
                        undefined,
                        true,
                        image,
                        ingredients,
                    ),
                );
            } else {
                return DatabaseApi.updateProductCount(
                    cart.products[productIndex],
                    cart.getProductCount(cart.products[productIndex]) + 1,
                );
            }
        });
    }

    render() {
        const cards1_2 = this.getCards(0, 1);
        const remainingCards = this.getCards(2, -1);
        const additionalCards = this.getAdditionalCards(1);
        const unloadedCard = (
            <View style={stylesheet.unloadedCardContainer}>
                <View style={{flex: 1}}>
                    <View style={stylesheet.unloadedTitle} />
                    <View style={stylesheet.unloadedImage} />
                </View>
                <View style={{flex: 1, marginLeft: 20}}>
                    <View style={stylesheet.unloadedCard} />
                    <View style={stylesheet.unloadedCard} />
                    <View style={stylesheet.unloadedCard} />
                    <View style={stylesheet.unloadedCard} />
                    <View style={stylesheet.unloadedCard} />
                </View>
            </View>
        );

        return (
            <ScrollView ref={this.scrollViewRef}>
                <ImageBackground
                    style={{width: "auto"}}
                    source={require("../../resources/assets/drawable/categories/poke-constructor-category.jpg")}>
                    <Text style={stylesheet.topText}>Собери свой идеальный ПОКÉ БОУЛ</Text>
                </ImageBackground>
                <Text style={stylesheet.titleText}>СОБРАТЬ ПОКÉ</Text>
                {this.state.isLoaded ? (
                    cards1_2
                ) : (
                    <View>
                        {unloadedCard}
                        {unloadedCard}
                    </View>
                )}
                <View
                    style={{
                        ...stylesheet.toggleButtonBlockContainer,
                        paddingHorizontal: stylesheet.container.paddingHorizontal,
                    }}>
                    <Text style={{...stylesheet.mainText, marginBottom: 20}}>Выполняем наполнители и топпинг</Text>
                    <View style={stylesheet.toggleButtonContainer}>
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
                            <Text style={{...stylesheet.text, textAlign: "center"}}>5 наполнителей, 1 топпинг</Text>
                        </View>
                        <Text style={{...stylesheet.text, ...stylesheet.orText}}>или</Text>
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
                            <Text style={{...stylesheet.text, textAlign: "center"}}>3 наполнителя, 2 топпинга</Text>
                        </View>
                    </View>
                </View>
                {this.state.isLoaded ? (
                    remainingCards
                ) : (
                    <View>
                        {unloadedCard}
                        {unloadedCard}
                        {unloadedCard}
                        {unloadedCard}
                    </View>
                )}
                <View style={stylesheet.done}>
                    <Text style={stylesheet.doneText}>ГОТОВО!</Text>
                    <Text style={{...stylesheet.subTitleText, fontSize: 18}}>ВЫ СОБРАЛИ ИДЕАЛЬНЫЙ ПОКЕ!</Text>
                    <View style={stylesheet.compositionContainer}>
                        <Tooltip
                            height={-1}
                            skipAndroidStatusBar
                            toggleOnPress={this.state.canDeployIngredientsPopover}
                            withOverlay={false}
                            backgroundColor={"#ffef75"}
                            width={
                                Dimensions.get("window").width - stylesheet.compositionContainer.paddingHorizontal / 2
                            }
                            pointerColor={"transparent"}
                            popover={
                                <View
                                    style={{
                                        width: "100%",
                                        borderRadius: 20,
                                    }}>
                                    <Text style={stylesheet.compositionText}>{this.state.selectedIngredients}</Text>
                                </View>
                            }>
                            <Text
                                numberOfLines={2}
                                style={stylesheet.compositionText}
                                onTextLayout={(event) => {
                                    if (event.nativeEvent.lines.length > 2 && !this.state.canDeployIngredientsPopover) {
                                        this.setState({canDeployIngredientsPopover: true});
                                    }
                                    if (event.nativeEvent.lines.length <= 2 && this.state.canDeployIngredientsPopover) {
                                        this.setState({canDeployIngredientsPopover: false});
                                    }
                                }}>
                                {this.state.selectedIngredients}
                            </Text>
                        </Tooltip>
                    </View>

                    <Text style={stylesheet.price}>{this.state.totalPrice + " ₽"}</Text>
                    <View
                        style={stylesheet.buyButton}
                        onTouchEnd={() =>
                            this.addToCart(this.state.selectedIngredients.slice(8), this.state.totalPrice, "")
                        }>
                        <Text style={stylesheet.buyText}>ЗАКАЗАТЬ</Text>
                    </View>
                    <Text
                        onPress={() => {
                            if (this.state.addIngredientOpen) {
                                this.needToScroll = true;
                            }
                            this.setState({addIngredientOpen: !this.state.addIngredientOpen});
                        }}
                        style={stylesheet.addIngredientText}>
                        {this.state.addIngredientOpen
                            ? "*Цена основного поке зависит от максимальной стоимости протеина"
                            : "Добавить ингридиент в поке"}
                    </Text>
                </View>
                {this.state.addIngredientOpen ? (
                    <View
                        style={stylesheet.addIngredientsContainer}
                        onLayout={(event) => {
                            if (this.needToScroll) {
                                this.needToScroll = false;
                                this.scrollViewRef.current?.scrollTo({
                                    x: 0,
                                    y: event.nativeEvent.layout.y,
                                    animated: true,
                                });
                            }
                        }}>
                        <Text style={{...stylesheet.subTitleText, paddingVertical: 30}}>Дополнительно</Text>
                        {additionalCards}
                    </View>
                ) : null}
            </ScrollView>
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
        paddingTop: 20,
        textAlign: "center",
    },
    mainText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 18,
        color: globalColors.mainTextColor,
        paddingHorizontal: 20,
        textAlign: "center",
    },
    text: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 14,
        color: globalColors.mainTextColor,
    },
    subTitleText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 23,
        color: globalColors.mainTextColor,
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
    toggleButtonBlockContainer: {
        alignItems: "center",
        marginTop: 40,
    },
    toggleButtonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
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
    addIngredientsContainer: {
        alignItems: "center",
        alignSelf: "center",
        paddingBottom: 20,
        width: "65%",
    },
    compositionContainer: {
        paddingHorizontal: 40,
        paddingVertical: 20,
        height: 76,
    },
    compositionText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontSize: 14,
        textAlign: "center",
    },
    unloadedCardContainer: {
        flexDirection: "row",
        marginTop: 40,
        paddingHorizontal: 20,
        flex: 1,
    },
    unloadedCard: {
        marginBottom: 10,
        width: "100%",
        height: 20,
        backgroundColor: globalColors.unloadedCard,
        borderRadius: 10,
    },
    unloadedImage: {
        backgroundColor: globalColors.unloadedCard,
        flex: 1,
        borderRadius: 9999,
    },
    unloadedTitle: {
        marginBottom: 10,
        width: "100%",
        height: 30,
        backgroundColor: globalColors.unloadedCard,
        borderRadius: 10,
    },
});

export default PokeConstructorScreen;
