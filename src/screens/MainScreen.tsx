import React, {Component, createRef} from "react";
import {
    Dimensions,
    View,
    ImageBackground,
    Text,
    StyleSheet,
} from "react-native";
import Header from "../components/Header";
import ProductCard, {
    stylesheet as productCardStylesheet,
} from "../components/ProductCard";
import {DataProvider, Dimension, LayoutProvider} from "recyclerlistview";
import {ProductType, translateCategoryName} from "../entities/ProductType";
import {
    CategorizedRecyclerListView,
    ICategorizedData,
} from "../components/CategorizedRecyclerListView";
import {globals} from "../../resources/styles";

export interface IMainScreenState {
    mainContainerWidth: number;
    productCardWidth: number;
    productsData: ICategorizedData[];
    currentCategory: string;
}

const imageSidesRatio = 1.2;
const productCardHeight = 111;

class MainScreen extends Component<any, IMainScreenState> {
    private list = createRef<CategorizedRecyclerListView>();
    private layoutSize: Dimension[];
    private layoutProvider: LayoutProvider;
    private dataProvider: DataProvider;

    constructor(props: any) {
        super(props);

        this.onCategoryCross = this.onCategoryCross.bind(this);
        const productsData = [
            {
                category: ProductType.Wok,
                items: [
                    {
                        name: "Вок 1",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                    {
                        name: "Вок 2",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 999.999,
                        crossOutPrice: 1000,
                    },
                    {
                        name: "Вок 3",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                    {
                        name: "Вок 4",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                ],
            },
            {
                category: ProductType.Poke,
                items: [
                    {
                        name: "Поке 1",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                        crossOutPrice: 10000,
                    },
                    {
                        name: "Поке 2",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                ],
            },
            {
                category: ProductType.Rolls,
                items: [
                    {
                        name: "Ролл 1",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                ],
            },
            {
                category: ProductType.Soups,
                items: [
                    {
                        name: "Суп 1",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 999999,
                    },
                ],
            },
            {
                category: ProductType.Beverages,
                items: [
                    {
                        name: "Русиано",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                ],
            },
            {
                category: ProductType.Deserts,
                items: [
                    {
                        name: "еда",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                    {
                        name: "хрень",
                        composition:
                            "Рис, лосось, авокадо, красный лук, салат, морковь",
                        price: 290,
                    },
                ],
            },
        ];

        this.state = {
            mainContainerWidth: Dimensions.get("window").width,
            productCardWidth:
                (Dimensions.get("window").width -
                    2 * stylesheet.paddings.paddingHorizontal -
                    stylesheet.paddings.paddingVertical) /
                2,
            productsData: productsData,
            currentCategory: translateCategoryName(productsData[0].category),
        };

        this._rowRenderer = this._rowRenderer.bind(this);

        this.layoutSize = [
            {
                width: this.state.mainContainerWidth,
                height: stylesheet.categoryHeight.height,
            },
            {
                width: this.state.mainContainerWidth / 2 - 0.0001,
                height:
                    productCardHeight +
                    (this.state.productCardWidth -
                        2 * productCardStylesheet.container.padding) /
                        imageSidesRatio +
                    stylesheet.productCardContainer.paddingVertical,
            },
            {
                width: this.state.mainContainerWidth / 2 - 0.0001,
                height:
                    productCardHeight +
                    (this.state.productCardWidth -
                        2 * productCardStylesheet.container.padding) /
                        imageSidesRatio +
                    stylesheet.productCardContainer.paddingVertical,
            },
        ];

        const providers = CategorizedRecyclerListView.buildProviders(
            this.layoutSize,
            this.state.productsData,
        );
        this.dataProvider = providers.dataProvider;
        this.layoutProvider = providers.layoutProvider;
    }

    componentDidUpdate(
        prevProps: Readonly<Readonly<any>>,
        prevState: Readonly<Readonly<IMainScreenState>>,
        snapshot?: any,
    ) {
        if (
            this.props.route.params?.category !=
            prevProps.route.params?.category
        ) {
            this.list.current?.scrollToCategory(
                this.props.route.params.category,
            );
        }
    }

    onCategoryCross(category: string) {
        this.setState({currentCategory: translateCategoryName(category)});
    }

    _rowRenderer(type: any, data: any) {
        switch (type) {
            case "category":
                return (
                    <View
                        style={{
                            ...productCardStylesheet.container,
                            ...stylesheet.category,
                            marginHorizontal:
                                stylesheet.productCardContainer
                                    .paddingHorizontal,
                        }}>
                        <Text numberOfLines={1} style={stylesheet.categoryText}>
                            {translateCategoryName(data.name)}
                        </Text>
                    </View>
                );
            case 0:
                return (
                    <View
                        style={{
                            marginTop:
                                stylesheet.productCardContainer.paddingVertical,
                            marginLeft:
                                stylesheet.productCardContainer
                                    .paddingHorizontal,
                        }}>
                        <ProductCard
                            width={this.state.productCardWidth}
                            name={data.name}
                            composition={data.composition}
                            price={data.price}
                            crossOutPrice={data.crossOutPrice}
                        />
                    </View>
                );
            case 1:
                return (
                    <View
                        style={{
                            marginTop:
                                stylesheet.productCardContainer.paddingVertical,
                            marginRight:
                                stylesheet.productCardContainer
                                    .paddingHorizontal,
                            alignItems: "flex-end",
                        }}>
                        <ProductCard
                            width={this.state.productCardWidth}
                            name={data.name}
                            composition={data.composition}
                            price={data.price}
                            crossOutPrice={data.crossOutPrice}
                        />
                    </View>
                );
            default:
                return null;
        }
    }

    render() {
        return (
            <ImageBackground
                source={require("../../resources/assets/drawable/background.png")}
                style={{flex: 1}}>
                <View style={stylesheet.backgroundOverlay}>
                    <Header
                        navigation={this.props.navigation}
                        category={this.state.currentCategory}
                    />
                    <CategorizedRecyclerListView
                        rowRenderer={this._rowRenderer}
                        onCrossCategory={this.onCategoryCross}
                        ref={this.list}
                        layoutProvider={this.layoutProvider}
                        dataProvider={this.dataProvider}
                    />
                </View>
            </ImageBackground>
        );
    }
}

export const stylesheet = StyleSheet.create({
    productCardContainer: {
        paddingVertical: 15,
        paddingHorizontal: 27,
    },
    container: {
        width: "100%",
    },
    paddings: {
        paddingHorizontal: 27,
        paddingVertical: 17,
    },
    category: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: globals.cardBackgroundColor,
    },
    categoryText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
    },
    categoryHeight: {
        height: 30,
    },
    backgroundOverlay: {
        backgroundColor: globals.backgroundOverlay,
        flex: 1,
        opacity: 0.95,
    },
});

export default MainScreen;
