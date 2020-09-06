import React, {Component, createRef} from "react";
import {Dimensions, View, ImageBackground, Text} from "react-native";
import {stylesheet} from "../../resources/styles";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {RecyclerListView} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import ModifiedRecyclerListView from "../components/ModifiedRecyclerListView";


export interface IMainScreenState {
  mainContainerWidth: number,
  productCardWidth: number,
  productsData: {
    category: ProductType,
    onCross: any,
    products: {
      name: string,
      composition: string,
      price: number,
      crossOutPrice?: number
    }[]
  }[],
  currentCategory: string,
}

const imageSidesRatio = 1.2;
const productCardHeight = 111;


class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {

  private list = createRef<RecyclerListView<any, any>>();
  private layoutSize: {width: number, height: number}[];

  constructor(props: any) {
    super(props);
    this.onCategoryCross = this.onCategoryCross.bind(this);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      productCardWidth: (
        Dimensions.get("window").width
        -2*stylesheet.mainScreenPaddings.paddingHorizontal
        -stylesheet.mainScreenPaddings.paddingVertical)/2,
      productsData: [
        {
          category: ProductType.Wok,
          onCross: this.onCategoryCross,
          products: [
            {
              name: "Вок 1",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
            {
              name: "Вок 2",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 999.999,
              crossOutPrice: 1000,
            },
            {
              name: "Вок 3",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
            {
              name: "Вок 4",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
          ]
        },
        {
          category: ProductType.Poke,
          onCross: this.onCategoryCross,
          products: [
            {
              name: "Поке 1",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
              crossOutPrice: 10000,
            },
            {
              name: "Поке 2",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
          ]
        },
        {
          category: ProductType.Rolls,
          onCross: this.onCategoryCross,
          products: [
            {
              name: "Ролл 1",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
          ]
        },
        {
          category: ProductType.Soups,
          onCross: this.onCategoryCross,
          products: [
            {
              name: "Суп 1",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 999999,
            },
          ]
        },
        {
          category: ProductType.Beverages,
          onCross: this.onCategoryCross,
          products: [
            {
              name: "Русиано",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
          ]
        },
        {
          category: ProductType.Deserts,
          onCross: this.onCategoryCross,
          products: [
            {
              name: "еда",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
            {
              name: "хрень",
              composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
              price: 290,
            },
          ]
        },
      ],
      currentCategory: ""
    };

    this._rowRenderer = this._rowRenderer.bind(this);

    this.layoutSize = [
      {
        width: this.state.mainContainerWidth,
        height: stylesheet.mainScreenCategoryHeight.height
      },
      {
        width: this.state.mainContainerWidth / 2 - 0.0001,
        height: productCardHeight
          + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/imageSidesRatio
          + stylesheet.mainScreenProductCardContainer.paddingVertical
      },
      {
        width: this.state.mainContainerWidth / 2 - 0.0001,
        height: productCardHeight
          + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/imageSidesRatio
          + stylesheet.mainScreenProductCardContainer.paddingVertical
      },
    ]
    this.state.currentCategory = translateCategoryName(this.state.productsData[0].category);
  }


  componentDidUpdate(prevProps: Readonly<Readonly<any>>, prevState: Readonly<Readonly<IMainScreenState>>, snapshot?: any) {

    if (this.props.route.params?.category != prevProps.route.params?.category){
      this.list.current?.scrollToIndex(
        this.findCategoryIndex(this.props.route.params?.category),
        true
      );
    }
  }

  onCategoryCross(category){
    this.setState({currentCategory: translateCategoryName(category)});
  }

  findCategoryIndex(category){
    let index = 0;
    for (let i = 0; this.state.productsData[i].category != category; i++,index++)
      index += this.state.productsData[i].products.length
    return index;
  }

  _rowRenderer(type: any, data: any) {
    switch (type) {
      case "category":
        return (
          <View style={{
            ...stylesheet.productCardContainer,
            ...stylesheet.mainScreenCategory,
            marginHorizontal: stylesheet.mainScreenProductCardContainer.paddingHorizontal,
          }}>
            <Text style={stylesheet.mainScreenCategoryText}>{translateCategoryName(data.name)}</Text>
          </View>
        )
      case 0:
        return (
          <View style={{
            marginTop: stylesheet.mainScreenProductCardContainer.paddingVertical,
            marginLeft: stylesheet.mainScreenProductCardContainer.paddingHorizontal
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
          <View style={{
            marginTop: stylesheet.mainScreenProductCardContainer.paddingVertical,
            marginRight: stylesheet.mainScreenProductCardContainer.paddingHorizontal,
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
          style={{flex: 1}}
        >
          <View style={stylesheet.backgroundOverlay}>
            <Header
              navigation={this.props.navigation}
              category={this.state.currentCategory}
            />
            <ModifiedRecyclerListView
              data={this.state.productsData}
              rowRenderer={this._rowRenderer}
              ref_={this.list}
              layoutSize={this.layoutSize}
            />
        </View>
        </ImageBackground>
    );
  }
}

export function translateCategoryName(category: any){
  switch (category) {
    case ProductType.Wok:
      return "Вок"
    case ProductType.Deserts:
      return "Десерты"
    case ProductType.Beverages:
      return "Напитки"
    case ProductType.Poke:
      return "Поке"
    case ProductType.Rolls:
      return "Роллы"
    case ProductType.Soups:
      return "Супы"
    default:
      return "Поке"
  }
}

export default MainScreen;
