import React, {Component, createRef} from "react";
import {Dimensions, PixelRatio, StyleSheet, Text, View} from "react-native";
import ProductCard from "../components/ProductCard";
import {DataProvider, Dimension, LayoutProvider} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import {CategorizedRecyclerListView} from "../components/CategorizedRecyclerListView";
import OpenDish from "../components/OpenDish";
import {globalColors} from "../../resources/styles";
import Product from "../entities/Product";
import FishIcon from "../../resources/assets/drawable/fish_icon2.svg";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import WokCard from "../components/WokCard";
import Ingredient from "../entities/Ingredient";
import InfoModal from "../components/InfoModal";
import DatabaseApi from "../utils/database/DatabaseApi";

export interface IMainScreenState {
    productCardSize: Dimension;
    currentCategory: string;
    modalVisible: boolean;
    currentProduct: Product | null;
    dataProvider: DataProvider;
    layoutProvider: LayoutProvider;
}

const windowSize = Dimensions.get("window");
const FISH_ICON_SIZE = {width: 47, height: 17};

class MainScreen extends Component<any, IMainScreenState> {
    private list = createRef<CategorizedRecyclerListView>();
    private layoutSize: Dimension[];
    private wokIngredients: Map<string, Ingredient[]> = new Map();
    private infoModal = createRef<InfoModal>();
    private openDishModal = createRef<OpenDish>();

    constructor(props: any) {
        super(props);

        this.onCategoryCross = this.onCategoryCross.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        const cardLayoutSize = {
            width: windowSize.width,
            height: 150,
        };
        this.layoutSize = [
            {
                width: windowSize.width,
                height: stylesheet.categoryHeight.height,
            },
            cardLayoutSize,
        ];

        const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, []);

        this.state = {
            productCardSize: cardLayoutSize,
            currentCategory: "",
            dataProvider: providers.dataProvider,
            layoutProvider: providers.layoutProvider,
            modalVisible: false,
            currentProduct: null,
        };
        this.onRemoveUnavailableProductsFromCart = this.onRemoveUnavailableProductsFromCart.bind(this);
    }

    componentDidMount() {
        RealtimeDatabaseApi.addProductsChangedListener(this._onProductsChanged);
        DatabaseApi.addOnRemoveUnavailableProductsListener(this.onRemoveUnavailableProductsFromCart);

        return RealtimeDatabaseApi.getProducts().then((products) => {
            return RealtimeDatabaseApi.getWokConstructorIngredients()
                .then((ingredients) => {
                    this.wokIngredients = ingredients;
                })
                .then(() => {
                    this._filterAvailableProducts(products);
                    const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, products);

                    this.setState({
                        currentCategory: ProductType.translateCategoryName(Array.from(products.keys())[0]),
                        dataProvider: providers.dataProvider,
                        layoutProvider: providers.layoutProvider,
                    });
                })
                .then(DatabaseApi.removeUnavailableProductsFromCart);
        });
    }

    componentDidUpdate(prevProps: Readonly<Readonly<any>>) {
        if (this.props.route.params?.category !== prevProps.route.params?.category) {
            this.list.current?.scrollToCategory(this.props.route.params.category);
        }
    }

    componentWillUnmount() {
        RealtimeDatabaseApi.removeProductsChangedListener(this._onProductsChanged);
        DatabaseApi.removeOnRemoveUnavailableProductsListener(this.onRemoveUnavailableProductsFromCart);
    }

    onCategoryCross(category: string) {
        this.setState({currentCategory: ProductType.translateCategoryName(category)});
    }

    private onRemoveUnavailableProductsFromCart(unavailableProducts: Product[]) {
        if (unavailableProducts.length > 0) {
            let text = InfoModal.PRODUCTS_IN_CART_UNAVAILABLE_PATTERN;
            text = text + unavailableProducts.map((it) => it.name).join(", ");
            const interval = setInterval(() => {
                if (this.infoModal && this.infoModal.current) {
                    this.infoModal.current.showInfo(text);
                    clearInterval(interval);
                }
            }, 300);
        }
    }

    private _onProductsChanged = (newProducts: Product[]) => {
        const data = this.state.dataProvider.getAllData();
        newProducts.forEach((newProduct) => {
            const foundItem = data.find((item) => item.item?.id === newProduct.id);
            if (foundItem) {
                foundItem.item = newProduct;
            } else {
                const categoryIndex = data.findIndex((item) => item?.name === newProduct.type);
                data.splice(categoryIndex + 1, 0, {type: "column0", item: newProduct});
            }
        });

        const newDataProvider = this.state.dataProvider.cloneWithRows(data);
        this.setState({
            dataProvider: newDataProvider,
        });
    };

    private _filterAvailableProducts(products: Map<ProductType, Product[]>): void {
        products.forEach((value, type) => {
            const filteredProducts = value.filter((it) => it.available);
            products.set(type, filteredProducts);
        });
    }

    private onCardClick(product: Product) {
        this.setState({currentProduct: product});
        this.openDishModal.current?.showModal();
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
                if (data.item.type === ProductType.Wok) {
                    const baseIngredients = this.wokIngredients.get("base");
                    const sauceIngredients = this.wokIngredients.get("souce");
                    return (
                        <WokCard
                            product={data.item}
                            onClick={this.onCardClick}
                            baseIngredients={baseIngredients ? baseIngredients : []}
                            sauceIngredients={sauceIngredients ? sauceIngredients : []}
                        />
                    );
                } else {
                    return <ProductCard product={data.item} onClick={this.onCardClick} />;
                }
            default:
                return null;
        }
    }

    render() {
        const baseIngredients = this.wokIngredients.get("base");
        const sauceIngredients = this.wokIngredients.get("souce");
        return (
            <View style={{flex: 1}}>
                <View style={{alignSelf: "flex-start"}} onTouchEnd={() => this.props.navigation.navigate("Categories")}>
                    <View style={stylesheet.categoryButton}>
                        <Text style={stylesheet.subTitle}>{this.state.currentCategory}</Text>
                        <FishIcon width={FISH_ICON_SIZE.width} height={FISH_ICON_SIZE.height} />
                    </View>
                    <View style={stylesheet.categoryUnderline} />
                </View>
                <View style={{flex: 1, marginTop: 10}}>
                    <CategorizedRecyclerListView
                        rowRenderer={this._rowRenderer}
                        onCrossCategory={this.onCategoryCross}
                        ref={this.list}
                        layoutProvider={this.state.layoutProvider}
                        dataProvider={this.state.dataProvider}
                        initialRenderIndex={1}
                    />
                    <OpenDish
                        ref={this.openDishModal}
                        width={windowSize.width - 2 * stylesheet.openDishModal.paddingHorizontal}
                        height={windowSize.height - 2 * stylesheet.openDishModal.paddingVertical}
                        product={this.state.currentProduct}
                        baseIngredients={baseIngredients}
                        sauceIngredients={sauceIngredients}
                    />
                    <InfoModal ref={this.infoModal} />
                </View>
            </View>
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
    category: {
        paddingLeft: 25,
        marginTop: 15,
    },
    categoryText: {
        fontFamily: "Mulish-Bold",
        fontSize: 14,
        lineHeight: 17,
        color: globalColors.primaryColor,
    },
    categoryHeight: {
        height: 50,
    },
    openDishModal: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: "100%",
        height: "100%",
    },
    categoryButton: {
        flexDirection: "row",
        marginLeft: 40,
        marginTop: 10,
    },
    subTitle: {
        fontFamily: "Mulish-Bold",
        fontSize: 16,
        lineHeight: 20,
        color: globalColors.primaryColor,
        marginRight: 7,
    },
    categoryUnderline: {
        backgroundColor: globalColors.headerUnderlineColor,
        width: "auto",
        height: 2,
        marginLeft: 38,
        marginTop: 3,
    },
});

export default MainScreen;
