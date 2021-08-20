import React, {Component} from "react";
import {Dimensions, StyleSheet, View} from "react-native";
import CategoryCard from "../components/CategoryCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";

export interface ICategoriesScreenState {
    mainContainerWidth: number;
    dataProvider: DataProvider;
}

const imageSources = {
    wok: require("../../resources/assets/drawable/categories/wok-category.jpg"),
    desserts: require("../../resources/assets/drawable/categories/desserts-category.jpg"),
    beverages: require("../../resources/assets/drawable/categories/beverages-category.jpg"),
    poke: require("../../resources/assets/drawable/categories/poke-category.jpg"),
    customPoke: require("../../resources/assets/drawable/categories/poke-constructor-category.jpg"),
    rolls: require("../../resources/assets/drawable/categories/rolls-category.jpg"),
    soups: require("../../resources/assets/drawable/categories/soups-category.jpg"),
};

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
                    imageSource: imageSources.customPoke,
                },
                {text: ProductType.Rolls, imageSource: imageSources.rolls},
                {text: ProductType.Poke, imageSource: imageSources.poke},
                {text: ProductType.Wok, imageSource: imageSources.wok},
                {text: ProductType.Beverages, imageSource: imageSources.beverages},
                {text: ProductType.Deserts, imageSource: imageSources.desserts},
                {text: ProductType.Soups, imageSource: imageSources.soups},
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
                            imageSource={data.imageSource}
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
                            width={"100%"}
                            height={"100%"}
                            imageSource={data.imageSource}
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
        marginTop: 10,
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
    headerFishBackButton: {
        position: "absolute",
        left: 0,
    },
    leftCard: {
        padding: 5,
        paddingLeft: 26,
    },
    rightCard: {
        padding: 5,
        paddingRight: 26,
    },
    fullWidthCard: {
        padding: 5,
        paddingHorizontal: 26,
    },
});

export default CategoriesScreen;
