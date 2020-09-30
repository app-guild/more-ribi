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
                return r1.value !== r2.value;
            }).cloneWithRows([
                {
                    text: ProductType.translateCategoryName(ProductType.Rolls),
                    value: ProductType.Rolls,
                },
                {
                    text: ProductType.translateCategoryName(ProductType.Poke),
                    value: ProductType.Poke,
                },
                {
                    text: ProductType.translateCategoryName(ProductType.Wok),
                    value: ProductType.Wok,
                },
                {
                    text: ProductType.translateCategoryName(ProductType.Beverages),
                    value: ProductType.Beverages,
                },
                {
                    text: ProductType.translateCategoryName(ProductType.Deserts),
                    value: ProductType.Deserts,
                },
                {
                    text: ProductType.translateCategoryName(ProductType.Soups),
                    value: ProductType.Soups,
                },
            ]),
        };
        this._rowRenderer = this._rowRenderer.bind(this);
    }

    private layoutProvider = new LayoutProvider(
        (index) => {
            return index % 2;
        },
        (type, dim) => {
            switch (type) {
                case 0:
                case 1:
                    dim.width = this.state.mainContainerWidth / 2 - 0.0001;
                    dim.height =
                        (this.state.mainContainerWidth -
                            2 * stylesheet.containerPadding.padding -
                            stylesheet.columnMargin.margin) /
                            2 +
                        stylesheet.columnMargin.margin;
                    break;
            }
        },
    );

    _rowRenderer(type: any, data: any) {
        switch (type) {
            case 0:
                return (
                    <View
                        style={{
                            marginLeft: stylesheet.containerPadding.padding,
                        }}>
                        <CategoryCard
                            size={
                                (this.state.mainContainerWidth -
                                    2 * stylesheet.containerPadding.padding -
                                    stylesheet.columnMargin.margin) /
                                2
                            }
                            text={data.text}
                            onTouchEnd={() =>
                                this.props.navigation.navigate("Main", {
                                    category: data.value,
                                })
                            }
                        />
                    </View>
                );
            case 1:
                return (
                    <View
                        style={{
                            alignItems: "flex-end",
                            marginRight: stylesheet.containerPadding.padding,
                        }}>
                        <CategoryCard
                            size={
                                (this.state.mainContainerWidth -
                                    2 * stylesheet.containerPadding.padding -
                                    stylesheet.columnMargin.margin) /
                                2
                            }
                            text={data.text}
                            onTouchEnd={() =>
                                this.props.navigation.navigate("Main", {
                                    category: data.value,
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
});

export default CategoriesScreen;
