import React, {Component, createRef} from "react";
import {Dimensions, View, ImageBackground, Text} from "react-native";
import {stylesheet} from "../../resources/styles";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";
import ModifiedRecyclerListView from "../components/ModifiedRecyclerListView";


export interface IMainScreenState {
  mainContainerWidth: number,
  productCardWidth: number,
  productsData: any[],
  currentCategory: string,
}

const imageSidesRatio = 1.2;
const productCardHeight = 111;


class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {

  private cardsPosition: any[];
  private list = createRef<RecyclerListView<any, any>>();
  private layoutForTypeDimensions: any[];
  private categoriesBorders: any[] = [];
  private prevCategoryIndex: number = 0;

  constructor(props: any) {
    super(props);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      productCardWidth: (
        Dimensions.get("window").width
        -2*stylesheet.mainScreenPaddings.paddingHorizontal
        -stylesheet.mainScreenPaddings.paddingVertical)/2,
      productsData: this.addCategoryNames([
          {
            name: "Вок 1",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Wok
          },
          {
            name: "Вок 2",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 999.999,
            crossOutPrice: 1000,
            category: ProductType.Wok
          },
          {
            name: "Вок 3",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Wok
          },
          {
            name: "Вок 4",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Wok
          },
          {
            name: "Поке 1",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            crossOutPrice: 10000,
            category: ProductType.Poke
          },
          {
            name: "Поке 2",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Poke
          },
          {
            name: "Ролл 1",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Rolls
          },
          {
            name: "Дрисня",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 999999,
            category: ProductType.Soups
          },
          {
            name: "Русиано",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Beverages
          },
          {
            name: "еда",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Deserts
          },
          {
            name: "хрень",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Deserts
          },
        ].sort((a, b) => {
          return a.category<b.category?-1:a.category>b.category?1:0
        })),
      currentCategory: ""
    };

    this._rowRenderer = this._rowRenderer.bind(this);
    this.cardsPosition = this.getCardsTypes(this.state.productsData);
    this.layoutForTypeDimensions = [
      {
        type: -1,
        width: this.state.mainContainerWidth,
        height: stylesheet.mainScreenCategoryHeight.height
      },
      {
        type: 0,
        width: this.state.mainContainerWidth / 2 - 0.0001,
        height: productCardHeight
          + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/imageSidesRatio
          + stylesheet.mainScreenProductCardContainer.paddingVertical
      },
      {
        type: 1,
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
      this.setState({currentCategory: translateCategoryName(this.props.route.params.category)});
      this.list.current?.scrollToIndex(
        this.state.productsData.findIndex((element: any) => {
          return element.name == undefined && element.category == this?.props?.route?.params?.category;
        }),
        true
      );
    }

  }

  _rowRenderer(type: any, data: any) {
    switch (type) {
      case -1:
        return (
          <View style={{
            ...stylesheet.productCardContainer,
            ...stylesheet.mainScreenCategory,
            marginHorizontal: stylesheet.mainScreenProductCardContainer.paddingHorizontal,
          }}>
            <Text style={stylesheet.mainScreenCategoryText}>{translateCategoryName(data.category)}</Text>
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

  getCardsTypes(data: any){
    let array = []
    for (let i=0, count=0; i<data.length; i++){
      if(data[i].name == undefined) {
        array.push(-1);
        count = 0;
      }
      else {
        array.push(count);
        count = count==0? 1:0;
      }
    }
    return array
  }

  addCategoryNames(data: any){
    let array = []
    for (let i=0; i<data.length; i++){
      if (data[i-1]?.category!=data[i].category)
        array.push({category: data[i].category});

      array.push(data[i])
    }
    return array;
  }

  onRecyclerListViewScroll(e: any){
    if (this.categoriesBorders.length){
      if (e.nativeEvent.contentOffset.y>this.categoriesBorders[this.prevCategoryIndex+1].offset)
        this.setState({currentCategory: translateCategoryName(this.categoriesBorders[(this.prevCategoryIndex++)+1].category)});
      if (e.nativeEvent.contentOffset.y>0 && e.nativeEvent.contentOffset.y<this.categoriesBorders[this.prevCategoryIndex].offset)
        this.setState({currentCategory: translateCategoryName(this.categoriesBorders[(this.prevCategoryIndex--)-1].category)});
    }
    else {
      for (let i = 0; i < this.state.productsData.length; i++){
        if(this.state.productsData[i].name==undefined)
          this.categoriesBorders.push({
            category: this.state.productsData[i].category,
            offset: this.list.current?.getLayout(i)?.y==undefined? -1: this.list.current?.getLayout(i)?.y -1
          })
      }
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
              getLayoutTypeForIndex = {(index) => {return this.cardsPosition[index]}}
              layoutForTypeDimensions = {this.layoutForTypeDimensions}
              //dataProvider={this.state.dataProvider}
              data={this.state.productsData}
              rowRenderer={this._rowRenderer}
              ref_={this.list}
              onScroll={(e: any)=>this.onRecyclerListViewScroll(e)}
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
