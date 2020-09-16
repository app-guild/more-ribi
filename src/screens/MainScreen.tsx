import React, {Component, createRef} from "react";
import {Dimensions, ImageBackground, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import Header from "../components/Header";
import ProductCard, {stylesheet as productCardStylesheet} from "../components/ProductCard";
import {DataProvider, Dimension, LayoutProvider} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import {CategorizedRecyclerListView} from "../components/CategorizedRecyclerListView";
import OpenDish from "../components/OpenDish";
import {getStatusBarHeight} from "react-native-status-bar-height";
import {globalColors} from "../../resources/styles";
import DatabaseApi from "../database/DatabaseApi";
import Product from "../entities/Product";
import Modal from "react-native-modal";

export interface IMainScreenState {
    mainContainerWidth: number;
    screenHeight: number;
    productCardWidth: number;
    currentCategory: string;
    modalVisible: boolean;
    currentProduct: Product | null;
    dataProvider: DataProvider;
    layoutProvider: LayoutProvider;
}

interface IProductGroup {
    category: ProductType;
    items: Product[];
}

const imageSidesRatio = 1.2;
const productCardHeight = 72;
const headerHeight = 83;

class MainScreen extends Component<any, IMainScreenState> {
    private list = createRef<CategorizedRecyclerListView>();
    private layoutSize: Dimension[];

    constructor(props: any) {
        super(props);

        this.onCategoryCross = this.onCategoryCross.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        const containerWidth = Dimensions.get("window").width;
        const containerHeight = Dimensions.get("window").height;
        const productCardWidth =
            (containerWidth - 2 * stylesheet.paddings.paddingHorizontal - stylesheet.paddings.paddingVertical) / 2;
        this.layoutSize = [
            {
                width: containerWidth,
                height: stylesheet.categoryHeight.height,
            },
            {
                width: containerWidth / 2 - 0.0001,
                height:
                    this._countProductCardHeight(productCardWidth) + stylesheet.productCardContainer.paddingVertical,
            },
            {
                width: containerWidth / 2 - 0.0001,
                height:
                    this._countProductCardHeight(productCardWidth) + stylesheet.productCardContainer.paddingVertical,
            },
        ];

        const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, []);

        this.state = {
            mainContainerWidth: containerWidth,
            screenHeight: containerHeight,
            productCardWidth,
            currentCategory: "",
            dataProvider: providers.dataProvider,
            layoutProvider: providers.layoutProvider,
            modalVisible: false,
            currentProduct: null,
        };
    }

    componentDidMount() {
        return DatabaseApi.getProducts().then((products) => {
            let productsData = splitProductsByType(products);
            productsData.push({category: ProductType.None, items: []});
            const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, productsData);

            this.setState({
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

    private _countProductCardHeight(productCardWidth: number) {
        return productCardHeight + (productCardWidth - 2 * productCardStylesheet.container.padding) / imageSidesRatio;
    }

    private onCardClick(product: Product) {
        this.setState({modalVisible: true, currentProduct: product});
    }

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
            case "column0":
            case "column1":
                return (
                    <View
                        style={
                            type === "column0"
                                ? {
                                      marginTop: stylesheet.productCardContainer.paddingVertical,
                                      marginLeft: stylesheet.productCardContainer.paddingHorizontal,
                                  }
                                : {
                                      marginTop: stylesheet.productCardContainer.paddingVertical,
                                      marginRight: stylesheet.productCardContainer.paddingHorizontal,
                                      alignItems: "flex-end",
                                  }
                        }>
                        <ProductCard
                            width={this.state.productCardWidth}
                            height={this._countProductCardHeight(this.state.productCardWidth)}
                            product={data.item}
                            onClick={this.onCardClick}
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
                    <Header
                        needCategoryName={!this.state.modalVisible}
                        navigation={this.props.navigation}
                        category={this.state.currentCategory}
                        onFishButton={() => {
                            this.setState({modalVisible: false});
                        }}
                    />
                    <View style={{flex: 1}}>
                        <CategorizedRecyclerListView
                            rowRenderer={this._rowRenderer}
                            onCrossCategory={this.onCategoryCross}
                            ref={this.list}
                            layoutProvider={this.state.layoutProvider}
                            dataProvider={this.state.dataProvider}
                            initialRenderIndex={1}
                        />
                        <Modal
                            isVisible={this.state.modalVisible}
                            animationIn={"zoomInUp"}
                            animationOut={"zoomOutUp"}
                            style={{margin: 0}}
                            onBackdropPress={() => {
                                this.setState({modalVisible: false});
                            }}
                            onBackButtonPress={() => {
                                this.setState({modalVisible: false});
                            }}>
                            <View style={{flex: 1}}>
                                <View style={stylesheet.centeredView}>
                                    <View style={stylesheet.openDishModal}>
                                        <OpenDish
                                            width={
                                                this.state.mainContainerWidth -
                                                2 * stylesheet.productCardContainer.paddingHorizontal -
                                                40
                                            }
                                            height={
                                                this.state.screenHeight -
                                                getStatusBarHeight() -
                                                headerHeight -
                                                stylesheet.openDishModal.paddingTop -
                                                stylesheet.openDishModal.paddingBottom
                                            }
                                            product={this.state.currentProduct}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
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
        color: globalColors.primaryColor,
    },
    categoryHeight: {
        height: 30,
    },
    backgroundOverlay: {
        backgroundColor: globalColors.backgroundOverlay,
        flex: 1,
        opacity: 0.95,
    },
    openDishModal: {
        paddingTop: 30,
        paddingBottom: 40,
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-end",
    },
});

export default MainScreen;
