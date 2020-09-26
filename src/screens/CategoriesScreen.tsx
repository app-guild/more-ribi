import React, {Component} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";
import CategoryCard from "../components/CategoryCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import {globalColors} from "../../resources/styles";

const FISH_ICON_SIZE = {width: 47, height: 17};

export interface ICategoriesScreenState {
    mainContainerWidth: number;
    dataProvider: DataProvider;
}

class CategoriesScreen extends Component<Readonly<any>, Readonly<ICategoriesScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            mainContainerWidth: Dimensions.get("window").width,
            dataProvider: new DataProvider((r1, r2) => {
                return r1.text !== r2.text;
            }).cloneWithRows([
                {
                    text: "Конструктор поке",
                    additionalText: "Собери свой идеальный поке!",
                },
                {text: ProductType.Rolls},
                {text: ProductType.Poke},
                {text: ProductType.Wok},
                {text: ProductType.Beverages},
                {text: ProductType.Deserts},
                {text: ProductType.Soups},
            ]),
        };
        this._rowRenderer = this._rowRenderer.bind(this);
    }

    private layoutProvider = new LayoutProvider(
        (index) => {
            return index === 0 ? "pokeConstructor" : "column" + ((index + 1) % 2);
        },
        (type, dim) => {
            switch (type) {
                case "column0":
                case "column1":
                    dim.width = this.state.mainContainerWidth / 2 - 0.0001;
                    dim.height = this.state.mainContainerWidth / 2 - 0.0001;
                    break;
                case "pokeConstructor":
                    dim.width = this.state.mainContainerWidth;
                    dim.height = this.state.mainContainerWidth / 4;
            }
        },
    );

    _rowRenderer(type: any, data: any) {
        switch (type) {
            case "column0":
            case "column1":
                return (
                    <View style={type === "column0" ? stylesheet.leftCard : stylesheet.rightCard}>
                        <CategoryCard
                            width={"100%"}
                            text={ProductType.translateCategoryName(data.text)}
                            onTouchEnd={() =>
                                this.props.navigation.navigate("Main", {
                                    category: data.text,
                                })
                            }
                        />
                    </View>
                );
            case "pokeConstructor":
                return (
                    <View style={stylesheet.fullWidthCard}>
                        <CategoryCard
                            width={"100%"} //this.state.mainContainerWidth - 2 * stylesheet.containerPadding.padding
                            height={"100%"}
                            text={data.text}
                            additionalText={data.additionalText}
                            onTouchEnd={() => this.props.navigation.navigate("PokeConstructor")}
                        />
                    </View>
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <View style={stylesheet.headerContainer}>
                    <View style={stylesheet.header}>
                        <FishIcon
                            width={FISH_ICON_SIZE.width}
                            height={FISH_ICON_SIZE.height}
                            style={stylesheet.headerFishBackButton}
                            onTouchEnd={() => this.props.navigation.goBack()}
                        />
                        <Text style={stylesheet.headerText}>Разделы</Text>
                    </View>
                </View>

                <RecyclerListView
                    layoutProvider={this.layoutProvider}
                    dataProvider={this.state.dataProvider}
                    rowRenderer={this._rowRenderer}
                />
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    columnMargin: {
        margin: 10,
    },
    containerPadding: {
        padding: 26,
    },
    headerContainer: {
        paddingVertical: 24,
        paddingHorizontal: 26,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
    },
    headerText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 20,
        color: globalColors.primaryColor,
    },
    headerFishBackButton: {
        position: "absolute",
        left: 0,
    },
    leftCard: {
        padding: 5,
        paddingLeft: 10,
    },
    rightCard: {
        padding: 5,
        paddingRight: 10,
    },
    fullWidthCard: {
        padding: 5,
        paddingHorizontal: 10,
    },
});

export default CategoriesScreen;
