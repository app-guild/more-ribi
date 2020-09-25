import React, {Component} from "react";
import {Dimensions, ImageBackground, StyleSheet, Text, View} from "react-native";
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
                {text: ProductType.Rolls},
                {text: ProductType.Poke},
                {text: ProductType.Wok},
                {text: ProductType.Beverages},
                {text: ProductType.Deserts},
                {text: ProductType.Soups},
                {
                    text: "Конструктор поке",
                    additionalText: "Собери свой идеальный поке!",
                },
            ]),
        };
        this._rowRenderer = this._rowRenderer.bind(this);
    }

    private layoutProvider = new LayoutProvider(
        (index) => {
            return index === this.state.dataProvider.getSize() - 1 ? "fullRow" : "column" + (index % 2);
        },
        (type, dim) => {
            switch (type) {
                case "column0":
                case "column1":
                    dim.width = this.state.mainContainerWidth / 2 - 0.0001;
                    dim.height =
                        (this.state.mainContainerWidth -
                            2 * stylesheet.containerPadding.padding -
                            stylesheet.columnMargin.margin) /
                            2 +
                        stylesheet.columnMargin.margin;
                    break;
                case "fullRow":
                    dim.width = this.state.mainContainerWidth;
                    dim.height =
                        (this.state.mainContainerWidth -
                            2 * stylesheet.containerPadding.padding -
                            stylesheet.columnMargin.margin) /
                            4 +
                        2 * stylesheet.columnMargin.margin;
            }
        },
    );

    _rowRenderer(type: any, data: any) {
        switch (type) {
            case "column0":
            case "column1":
                return (
                    <View
                        style={
                            parseInt(type.slice(-1)) === 0
                                ? {
                                      marginLeft: stylesheet.containerPadding.padding,
                                  }
                                : {
                                      alignItems: "flex-end",
                                      marginRight: stylesheet.containerPadding.padding,
                                  }
                        }>
                        <CategoryCard
                            width={
                                (this.state.mainContainerWidth -
                                    2 * stylesheet.containerPadding.padding -
                                    stylesheet.columnMargin.margin) /
                                2
                            }
                            text={ProductType.translateCategoryName(data.text)}
                            onTouchEnd={() =>
                                this.props.navigation.navigate("Main", {
                                    category: data.text,
                                })
                            }
                        />
                    </View>
                );
            case "fullRow":
                return (
                    <View style={{marginLeft: stylesheet.containerPadding.padding}}>
                        <CategoryCard
                            width={this.state.mainContainerWidth - 2 * stylesheet.containerPadding.padding}
                            height={93}
                            text={data.text}
                            additionalText={data.additionalText}
                            onTouchEnd={() =>
                                this.props.navigation.navigate("Main", {
                                    category: "pokeConstructor",
                                })
                            }
                        />
                    </View>
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <ImageBackground source={require("../../resources/assets/drawable/background.png")} style={{flex: 1}}>
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
});

export default CategoriesScreen;
