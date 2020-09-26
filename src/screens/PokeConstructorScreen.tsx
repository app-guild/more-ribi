import React, {Component, createRef} from "react";
import {ImageBackground, Text, View, ScrollView, StyleSheet, Dimensions} from "react-native";
import {globalColors} from "../../resources/styles";
import PokeConstructorCard from "../components/PokeConstructorCard";
import CheckBoxGroup from "../components/СheckBoxGroup";
import {Tooltip} from "react-native-elements";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Ingredient from "../entities/Ingredient";
import {PokeIngredients} from "../entities/PokeIngredients";
import RadioButtonGroup from "../components/RadioButtonGroup";

export interface IPokeConstructorScreenState {
    addIngredientOpen: boolean;
    toppingSwitch: 1 | 2;
    totalPrice: number;
    canDeployIngredientsPopover: boolean;
    isIngredientsPopoverDeployed: boolean;
    data: Map<string, Ingredient[]>;
}

export enum ChoiceType {
    RadioButton = "radioButton",
    CheckBox = "checkBox",
}

export enum ChoicesLocation {
    Right = "right",
    Bottom = "bottom",
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
        };
        //this.onAdditionalClick = this.onAdditionalClick.bind(this);
        //this.onCardClick = this.onCardClick.bind(this);
    }

    componentDidMount() {
        return RealtimeDatabaseApi.getPokeConstructorIngredients().then((ingredients) => {
            this.setState({data: ingredients});
        });
    }

    // private onCardClick(values: boolean[], changed: boolean, changedIndex: number, id: number) {
    //     if (id === 1 && changed) {
    //         const proteinPrice = standardProteinPrice[changedIndex];
    //         const additionalProteinIndex = this.additionalIngredientsRefs[0]?.getCheckedIndexes()[0];
    //         const additionalProteinPrice = parseInt(
    //             this.data[1].additionalText ? this.data[1].additionalText[changedIndex].slice(2, -2) : "100",
    //         );
    //
    //         if (additionalProteinIndex && standardProteinPrice[additionalProteinIndex] > proteinPrice) {
    //             this.setState({
    //                 totalPrice:
    //                     standardProteinPrice[additionalProteinIndex] +
    //                     this.additionalSumByCategories.reduce((partial_sum, a) => partial_sum + a, 0) -
    //                     this.additionalSumByCategories[0] +
    //                     additionalProteinPrice,
    //             });
    //         } else {
    //             this.setState({
    //                 totalPrice:
    //                     proteinPrice + this.additionalSumByCategories.reduce((partial_sum, a) => partial_sum + a, 0),
    //             });
    //         }
    //     } else {
    //         this.setState({});
    //     }
    // }
    //
    // private onAdditionalClick(values: boolean[], changed: boolean, changedIndex: number, id: number) {
    //     if (changed) {
    //         let sum = 0;
    //         const proteinIndex = this.cardRefs[1] ? this.cardRefs[1].getCheckedIndexes()[0] : 0;
    //         const proteinPrice = standardProteinPrice[proteinIndex];
    //
    //         if (this.additionalTitleText[id] === "") {
    //             this.data[id + 1].additionalText?.forEach((val, index, array) => {
    //                 if (values[index]) {
    //                     sum += parseInt(val.slice(2, -2));
    //                     if (proteinPrice < sum) {
    //                         this.additionalSumByCategories[id] = sum;
    //
    //                         this.setState({
    //                             totalPrice:
    //                                 standardProteinPrice[index] +
    //                                 this.additionalSumByCategories.reduce((partial_sum, a) => partial_sum + a, 0) -
    //                                 sum +
    //                                 parseInt(array[proteinIndex].slice(2, -2)),
    //                         });
    //                         return;
    //                     }
    //                 }
    //             });
    //             this.additionalSumByCategories[id] = sum;
    //         } else {
    //             values.forEach((val) => {
    //                 if (val) {
    //                     sum += parseInt(this.additionalTitleText[id].slice(2, -2));
    //                 }
    //             });
    //             this.additionalSumByCategories[id] = sum;
    //         }
    //         this.setState({
    //             totalPrice:
    //                 proteinPrice + this.additionalSumByCategories.reduce((partial_sum, a) => partial_sum + a, 0),
    //         });
    //     }
    // }

    private initCards(start: number, end: number): JSX.Element[] {
        let result: JSX.Element[] = [];
        let ingredients;
        end = end < 0 ? this.state.data.size + end : end;
        for (let i = start; i <= end; i++) {
            ingredients = this.state.data.get(staticData[i].title);
            result.push(
                <PokeConstructorCard
                    ref={(ref) => {
                        this.cardRefs[i] = ref;
                        return true;
                    }}
                    key={i}
                    data={{
                        title: PokeIngredients.translateCategoryName(PokeIngredients.parse(staticData[i].title)),
                        number: i + 1,
                        image: staticData[i].imageSource,
                        smallImage: staticData[i].iconSource,
                        ingredients: ingredients ? ingredients : [],
                        choiceType: staticData[i].choiceType,
                        choicesLocation: staticData[i].choicesLocation,
                        choiceLimit: staticData[i].choiceLimit,
                        //onClick: this.onCardClick,
                    }}
                />,
            );
        }
        return result;
    }

    private initAdditionalCards(): JSX.Element[] {
        let result: JSX.Element[] = [];
        let ingredients;
        for (let i = 1; i < this.state.data.size; i++) {
            ingredients = this.state.data.get(staticData[i].title);
            result.push(
                <>
                    <View style={{flexDirection: "row"}}>
                        <Text style={{...stylesheet.subTitleText, marginTop: 30, marginLeft: 10}}>
                            {PokeIngredients.translateCategoryName(PokeIngredients.parse(staticData[i].title))}
                        </Text>
                        {staticData[i].additionalTextType === AdditionalTextType.OnlyTitle ? (
                            <Text style={{...stylesheet.additionalText, marginTop: 30}}>
                                {ingredients ? " (+" + ingredients[0].additionalPrice + "₽)" : null}
                            </Text>
                        ) : null}
                    </View>

                    {staticData[i].choiceType === ChoiceType.CheckBox ? (
                        <CheckBoxGroup
                            ref={(ref) => {
                                this.additionalIngredientsRefs[i] = ref;
                                return true;
                            }}
                            choices={ingredients ? ingredients : []}
                            needAdditionalText={staticData[i].additionalTextType === AdditionalTextType.AllChoices}
                            //onClick={onClick}
                        />
                    ) : (
                        <RadioButtonGroup
                            ref={(ref) => {
                                this.additionalIngredientsRefs[i] = ref;
                                return true;
                            }}
                            choices={ingredients ? ingredients : []}
                            needAdditionalText={staticData[i].additionalTextType === AdditionalTextType.AllChoices}
                            canUncheck={true}
                            //onClick={onClick}
                        />
                    )}
                </>,
            );
        }
        return result;
    }

    // private getTotalPrice(): number {
    //
    // }

    render() {
        const cards1_2 = this.initCards(0, 1);
        const RemainingCards = this.initCards(2, -1);
        const additionalCards = this.initAdditionalCards();
        const ingredients = <View />;
        //     (() => {
        //     let currentIngredients: string[] = [];
        //     this.cardRefs.forEach((value, index) => {
        //         value?.getCheckedIndexes().forEach((value1) => {
        //             currentIngredients.push(this.data[index].choices[value1] + ", ");
        //         });
        //     });
        //     if (currentIngredients.length) {
        //         currentIngredients[currentIngredients.length - 1] = currentIngredients[
        //             currentIngredients.length - 1
        //         ].slice(0, -2);
        //     } else {
        //         currentIngredients.push("рис, тунец, терияки, кешью");
        //     }
        //     return currentIngredients;
        // }).call(this);

        const addIngredients = <View />; //(() => {
        //     let currentIngredients: string[] = [];
        //     this.additionalIngredientsRefs.forEach((value, index) => {
        //         value?.getCheckedIndexes().forEach((value1) => {
        //             if (currentIngredients.length === 0) {
        //                 currentIngredients.push("\nДополнительно: ");
        //             }
        //
        //             currentIngredients.push(this.data[index + 1].choices[value1] + ", ");
        //         });
        //     });
        //     if (currentIngredients.length) {
        //         currentIngredients[currentIngredients.length - 1] = currentIngredients[
        //             currentIngredients.length - 1
        //         ].slice(0, -2);
        //     }
        //     return currentIngredients;
        // }).call(this);
        //
        // this.data.map((value, index) => {
        //     let currentIngredients: string[] = [];
        //
        //     this.cardRefs[index]?.getCheckedIndexes().forEach((value2) => {
        //         currentIngredients.push(value.choices[value2] + ", ");
        //     });
        //     this.additionalIngredientsRefs[index - 1]?.getCheckedIndexes().forEach((value3) => {
        //         currentIngredients.push(value.choices[value3] + ", ");
        //     });
        //     if (currentIngredients.length) {
        //         currentIngredients[currentIngredients.length - 1] = currentIngredients[
        //             currentIngredients.length - 1
        //         ].slice(0, -2);
        //     }
        //     return <Text key={index}>{currentIngredients}</Text>;
        // });

        return (
            <ScrollView ref={this.scrollViewRef}>
                <ImageBackground
                    style={{width: "auto"}}
                    source={require("../../resources/assets/drawable/categories/poke-constructor-category.jpg")}>
                    <Text style={stylesheet.topText}>Собери свой идеальный ПОКÉ БОУЛ</Text>
                </ImageBackground>
                <Text style={stylesheet.titleText}>СОБРАТЬ ПОКÉ</Text>
                {cards1_2}
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
                {RemainingCards}
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
                                        padding: 10,
                                        borderRadius: 20,
                                    }}>
                                    <Text
                                        style={{
                                            ...stylesheet.compositionText,
                                            width: "100%",
                                        }}>
                                        <Text>Состав: </Text>
                                        {ingredients}
                                        {addIngredients}
                                    </Text>
                                </View>
                            }>
                            <Text
                                numberOfLines={2}
                                style={{
                                    ...stylesheet.compositionText,
                                }}
                                onTextLayout={(event) => {
                                    if (event.nativeEvent.lines.length > 2 && !this.state.canDeployIngredientsPopover) {
                                        this.setState({canDeployIngredientsPopover: true});
                                    }
                                    if (event.nativeEvent.lines.length <= 2 && this.state.canDeployIngredientsPopover) {
                                        this.setState({canDeployIngredientsPopover: false});
                                    }
                                }}>
                                <Text>Состав: </Text>
                                {ingredients}
                                {addIngredients}
                            </Text>
                        </Tooltip>
                    </View>

                    <Text style={stylesheet.price}>{this.state.totalPrice + " ₽"}</Text>
                    <View style={stylesheet.buyButton}>
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
});

export default PokeConstructorScreen;
