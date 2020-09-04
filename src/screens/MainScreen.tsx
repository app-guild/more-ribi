import React, {Component, createRef} from "react";
import {Dimensions, View, ImageBackground, Text} from "react-native";
import {stylesheet} from "../../resources/styles";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {ProductType} from "../entities/ProductType";


export interface IMainScreenState {
  mainContainerWidth: number,
  productCardWidth: number,
  dataProvider: any,
}

const imageSidesRatio = 1.2;
const productCardHeight = 111;

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {

  list = createRef<RecyclerListView<any, any>>();

  constructor(props: any) {
    super(props);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      productCardWidth: (
        Dimensions.get("window").width
        -2*stylesheet.mainScreenPaddings.paddingHorizontal
        -stylesheet.mainScreenPaddings.paddingVertical)/2,
      dataProvider: new DataProvider((r1, r2) => {
        return r1.id !== r2.id;
      }).cloneWithRows(
        this.addCategoryNames([
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
        }))),
    };

    this._rowRenderer = this._rowRenderer.bind(this);
    this.cardsPosition = this.getCardsPosition(this.state.dataProvider._data);
  }

  private cardsPosition: any[];

  componentDidUpdate(prevProps: Readonly<Readonly<any>>, prevState: Readonly<Readonly<IMainScreenState>>, snapshot?: any) {
    this.list.current?.scrollToIndex(
      this.state.dataProvider._data.findIndex((element: any) => {
        if (element.name == undefined && element.category == this?.props?.route?.params?.category)
          return true;
        return false
      }),
      true
    );
    // if(this?.props?.route?.params?.category)
    //   this.list.current?.scrollToOffset(0,this.list.current?.getCurrentScrollOffset()+1,true)
  }

  private layoutProvider = new LayoutProvider(
    index => {
      return this.cardsPosition[index];
    },
    (type, dim) => {
      switch (type) {
        case -1:
          dim.width = this.state.mainContainerWidth;
          dim.height = stylesheet.mainScreenCategoryHeight.height;
          break;
        case 0:
          dim.width = this.state.mainContainerWidth / 2 - 0.0001;
          dim.height = productCardHeight
            + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/imageSidesRatio
            + stylesheet.mainScreenProductCardContainer.paddingVertical
          break;
        case 1:
          dim.width = this.state.mainContainerWidth / 2;
          dim.height = productCardHeight
            + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/imageSidesRatio
            + stylesheet.mainScreenProductCardContainer.paddingVertical
          break;
      }
    }
  )

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

  getCardsPosition(data: any){
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

  render() {
    return (
        <ImageBackground
          source={require("../../resources/assets/drawable/background.png")}
          style={{flex: 1}}
        >
          <View style={stylesheet.backgroundOverlay}>
            <Header
              navigation={this.props.navigation}
              category={this.props.route.params==undefined?
                translateCategoryName(this.state.dataProvider._data[0].category)
                : translateCategoryName(this.props.route.params.category)}
            />
            <RecyclerListView
              layoutProvider={this.layoutProvider}
              dataProvider={this.state.dataProvider}
              rowRenderer={this._rowRenderer}
              ref={this.list}
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
