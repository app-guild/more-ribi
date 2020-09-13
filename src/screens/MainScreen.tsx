import React, {Component, createRef} from "react";
import {
    Dimensions,
    ImageBackground,
    StyleSheet,
    Text,
    View,
    Modal,
    TouchableWithoutFeedback,
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
import OpenDish from "../components/OpenDish";
import {getStatusBarHeight} from "react-native-status-bar-height";

export interface IMainScreenState {
    mainContainerWidth: number;
    screenHeight: number;
    productCardWidth: number;
    productsData: ICategorizedData[];
    currentCategory: string;
    modalVisible: boolean;
    currentProduct: IProduct | null;
}

export interface IProduct {
    name: string;
    //image: any;
    price: number;
    crossOutPrice: number;
    composition?: string;
}

const imageSidesRatio = 1.2;
const productCardHeight = 72;
const headerHeight = 83;

class MainScreen extends Component<any, IMainScreenState> {
    private list = createRef<CategorizedRecyclerListView>();
    private layoutSize: Dimension[];
    private layoutProvider: LayoutProvider;
    private dataProvider: DataProvider;

    constructor(props: any) {
        super(props);

        this.onCategoryCross = this.onCategoryCross.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
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
            {
                category: ProductType.Beverages,
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
            {
                category: ProductType.Beverages,
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
            {
                category: ProductType.Beverages,
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
            {
                category: ProductType.Beverages,
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
            {
                category: ProductType.Empty,
                items: [],
            },
        ];

        this.state = {
            mainContainerWidth: Dimensions.get("window").width,
            screenHeight: Dimensions.get("window").height,
            productCardWidth:
                (Dimensions.get("window").width -
                    2 * stylesheet.paddings.paddingHorizontal -
                    stylesheet.paddings.paddingVertical) /
                2,
            productsData: productsData,
            currentCategory: translateCategoryName(productsData[0].category),
            modalVisible: false,
            currentProduct: null,
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

    onCardClick(product: IProduct) {
        this.setState({modalVisible: true, currentProduct: product});
    }

    _rowRenderer(type: any, data: any) {
        switch (type) {
            case "category":
                return (
                    <View
                        style={{
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
                            height={
                                productCardHeight +
                                (this.state.productCardWidth -
                                    2 *
                                        productCardStylesheet.container
                                            .padding) /
                                    imageSidesRatio
                            }
                            product={data}
                            onClick={this.onCardClick}
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
                            height={
                                productCardHeight +
                                (this.state.productCardWidth -
                                    2 *
                                        productCardStylesheet.container
                                            .padding) /
                                    imageSidesRatio
                            }
                            product={data}
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
            <ImageBackground
                source={require("../../resources/assets/drawable/background.png")}
                style={{flex: 1}}>
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
                            layoutProvider={this.layoutProvider}
                            dataProvider={this.dataProvider}
                            initialRenderIndex={1}
                        />
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                this.setState({modalVisible: false});
                            }}>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    this.setState({modalVisible: false});
                                }}>
                                <View style={{flex: 1}} />
                            </TouchableWithoutFeedback>

                            <View style={stylesheet.centeredView}>
                                <View style={stylesheet.openDishModal}>
                                    <OpenDish
                                        width={
                                            this.state.mainContainerWidth -
                                            2 *
                                                stylesheet.productCardContainer
                                                    .paddingHorizontal
                                        }
                                        height={
                                            this.state.screenHeight -
                                            getStatusBarHeight() -
                                            headerHeight -
                                            2 *
                                                stylesheet.openDishModal
                                                    .paddingVertical
                                        }
                                        product={this.state.currentProduct}
                                    />
                                </View>
                            </View>
                        </Modal>
                    </View>
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
    openDishModal: {
        paddingVertical: 20,
    },
    centeredView: {
        backgroundColor: globals.cardBackgroundColor,
        alignItems: "center",
        justifyContent: "flex-end",
    },
});

export default MainScreen;
