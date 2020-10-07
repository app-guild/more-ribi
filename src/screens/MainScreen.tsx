import React, {Component, createRef} from "react";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import ProductCard from "../components/ProductCard";
import {DataProvider, Dimension, LayoutProvider} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import {CategorizedRecyclerListView} from "../components/CategorizedRecyclerListView";
import OpenDish from "../components/OpenDish";
import {globalColors} from "../../resources/styles";
import Product from "../entities/Product";
import Modal from "react-native-modal";
import FishIcon from "../../resources/assets/drawable/fish_icon2.svg";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import WokCard from "../components/WokCard";
import Ingredient from "../entities/Ingredient";

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

    constructor(props: any) {
        super(props);

        this.onCategoryCross = this.onCategoryCross.bind(this);
        this._rowRenderer = this._rowRenderer.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        const cardLayoutSize = {
            width: windowSize.width,
            height: windowSize.height * 0.15,
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
    }

    componentDidMount() {
        return RealtimeDatabaseApi.getProducts().then((splitProducts) => {
            RealtimeDatabaseApi.getWokConstructorIngredients().then((ingredients) => {
                this.wokIngredients = ingredients;
            });
            const providers = CategorizedRecyclerListView.buildProviders(this.layoutSize, splitProducts);

            this.setState({
                currentCategory: ProductType.translateCategoryName(Array.from(splitProducts.keys())[0]),
                dataProvider: providers.dataProvider,
                layoutProvider: providers.layoutProvider,
            });
        });
    }

    componentDidUpdate(prevProps: Readonly<Readonly<any>>) {
        if (this.props.route.params?.category !== prevProps.route.params?.category) {
            this.list.current?.scrollToCategory(this.props.route.params.category);
        }
    }

    onCategoryCross(category: string) {
        this.setState({currentCategory: ProductType.translateCategoryName(category)});
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
                        <View
                            style={{
                                ...stylesheet.openDishModal,
                            }}>
                            <OpenDish
                                width={windowSize.width - 2 * stylesheet.openDishModal.paddingHorizontal}
                                height={windowSize.height - 2 * stylesheet.openDishModal.paddingVertical}
                                product={this.state.currentProduct}
                                baseIngredients={
                                    this.state.currentProduct?.type === ProductType.Wok ? baseIngredients : undefined
                                }
                                sauceIngredients={
                                    this.state.currentProduct?.type === ProductType.Wok ? sauceIngredients : undefined
                                }
                            />
                        </View>
                    </Modal>
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
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
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
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
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
