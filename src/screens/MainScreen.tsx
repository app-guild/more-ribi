import React, {Component, createRef} from "react";
import {Dimensions, ImageBackground, StyleSheet, Text, View} from "react-native";
import Header from "../components/Header";
import ProductCard, {stylesheet as productCardStylesheet} from "../components/ProductCard";
import {DataProvider, Dimension, LayoutProvider} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import {CategorizedRecyclerListView, ICategorizedData} from "../components/CategorizedRecyclerListView";
import {globals} from "../../resources/styles";
import DatabaseApi from "../database/DatabaseApi";
import Product from "../entities/Product";

export interface IMainScreenState {
    mainContainerWidth: number;
    productCardWidth: number;
    currentCategory: string;
    dataProvider: DataProvider;
    layoutProvider: LayoutProvider;
}

interface IProductGroup {
    category: ProductType;
    items: Product[];
}

const imageSidesRatio = 1.2;
const productCardHeight = 72;

class MainScreen extends Component<any, IMainScreenState> {
    private list = createRef<CategorizedRecyclerListView>();
    private layoutSize: Dimension[];

    private countProductCardHeight = (productCardWidth: number) =>
        productCardHeight + (productCardWidth - 2 * productCardStylesheet.container.padding) / imageSidesRatio;

    constructor(props: any) {
        super(props);

        this.onCategoryCross = this.onCategoryCross.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);

        const containerWidth = Dimensions.get("window").width;
        const productCardWidth =
            (containerWidth - 2 * stylesheet.paddings.paddingHorizontal - stylesheet.paddings.paddingVertical) / 2;
        this.layoutSize = [
            {
                width: containerWidth,
                height: stylesheet.categoryHeight.height,
            },
            {
                width: containerWidth / 2 - 0.0001,
                height: this.countProductCardHeight(productCardWidth) + stylesheet.productCardContainer.paddingVertical,
            },
            {
                width: containerWidth / 2 - 0.0001,
                height: this.countProductCardHeight(productCardWidth) + stylesheet.productCardContainer.paddingVertical,
            },
        ];

        const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, []);

        this.state = {
            mainContainerWidth: containerWidth,
            productCardWidth,
            currentCategory: "",
            dataProvider: providers.dataProvider,
            layoutProvider: providers.layoutProvider,
        };
    }

    componentDidMount() {
        return DatabaseApi.getProducts().then((products) => {
            const productsData = splitProductsByType(products);
            const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, productsData);

            this.setState({
                ...this.state,
                currentCategory: ProductType.translateCategoryName(productsData[0]?.category),
                dataProvider: providers.dataProvider,
                layoutProvider: providers.layoutProvider,
            });
        });
    }

    componentDidUpdate(
        prevProps: Readonly<Readonly<any>>,
        prevState: Readonly<Readonly<IMainScreenState>>,
        snapshot?: any,
    ) {
        if (this.props.route.params?.category !== prevProps.route.params?.category) {
            this.list.current?.scrollToCategory(this.props.route.params.category);
        }
    }

    onCategoryCross(category: string) {
        this.setState({currentCategory: ProductType.translateCategoryName(category)});
    }

    // TODO нужно явно указать типы, хуй поймешь что это такое
    private _rowRenderer(type: any, data: any) {
        switch (type) {
            case "category":
                return (
                    <View
                        style={{
                            ...stylesheet.category,
                            marginHorizontal: stylesheet.productCardContainer.paddingHorizontal,
                        }}>
                        <Text numberOfLines={1} style={stylesheet.categoryText}>
                            {ProductType.translateCategoryName(data.name)}
                        </Text>
                    </View>
                );
            case 0:
                // TODO в case 1 дублирование кода, отличается одним стилем
                return (
                    <View
                        style={{
                            marginTop: stylesheet.productCardContainer.paddingVertical,
                            marginLeft: stylesheet.productCardContainer.paddingHorizontal,
                        }}>
                        <ProductCard
                            width={this.state.productCardWidth}
                            height={this.countProductCardHeight(this.state.productCardWidth)}
                            product={data.item}
                        />
                    </View>
                );
            case 1:
                return (
                    <View
                        style={{
                            marginTop: stylesheet.productCardContainer.paddingVertical,
                            marginRight: stylesheet.productCardContainer.paddingHorizontal,
                            alignItems: "flex-end",
                        }}>
                        <ProductCard
                            width={this.state.productCardWidth}
                            height={this.countProductCardHeight(this.state.productCardWidth)}
                            product={data.item}
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
                <View style={stylesheet.backgroundOverlay}>
                    <Header navigation={this.props.navigation} category={this.state.currentCategory} />
                    <CategorizedRecyclerListView
                        rowRenderer={this._rowRenderer}
                        onCrossCategory={this.onCategoryCross}
                        ref={this.list}
                        layoutProvider={this.state.layoutProvider}
                        dataProvider={this.state.dataProvider}
                        initialRenderIndex={0} // TODO почему 1? Если нет данных валится ошибка
                    />
                </View>
            </ImageBackground>
        );
    }
}

function splitProductsByType(products: Product[]): IProductGroup[] {
    return [
        {
            category: ProductType.Wok,
            items: products.filter((product) => product.type === ProductType.Wok),
        },
        {
            category: ProductType.Deserts,
            items: products.filter((product) => product.type === ProductType.Deserts),
        },
        {
            category: ProductType.Poke,
            items: products.filter((product) => product.type === ProductType.Poke),
        },
        {
            category: ProductType.Beverages,
            items: products.filter((product) => product.type === ProductType.Beverages),
        },
        {
            category: ProductType.Rolls,
            items: products.filter((product) => product.type === ProductType.Rolls),
        },
        {
            category: ProductType.Soups,
            items: products.filter((product) => product.type === ProductType.Soups),
        },
    ];
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
        paddingLeft: 25,
        marginTop: 15,
    },
    categoryText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
        color: globals.primaryColor,
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
