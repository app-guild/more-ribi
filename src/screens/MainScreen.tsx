import React, {Component} from "react";
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
  scrollOffset: any,
}

const imageSidesRatio = 1.2;
const productCardHeight = 111;

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {

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
            name: "Вок 5",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            category: ProductType.Wok
          },
        ].sort((a, b) => {
          return a.category<b.category?-1:a.category>b.category?1:0
        }))),
      scrollOffset: this.state?.dataProvider!=undefined?this.getPositionOfCategory(this.props.route.params==undefined?
        ProductType.Poke
        : this.props.route.params.category, this.state.dataProvider._data):0,
    };

    this._rowRenderer = this._rowRenderer.bind(this);
    this.cardsPosition = this.getCardsPosition(this.state.dataProvider._data);
  }

  private cardsPosition: any[];

  componentDidMount() {
    this.setState({scrollOffset:
        this.getPositionOfCategory(this.props.route.params==undefined?
          ProductType.Rolls
          : this.props.route.params.category, this.state.dataProvider._data)
    })
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

  getPositionOfCategory(category, data){
    let index = data.findIndex((element) => {
      if (element.name == undefined && element.category == category)
        return true;
      return false
    })

    let position = 0;

    for (let i=0; i<index; i++){
      if (data[i].name == undefined){
        position += stylesheet.mainScreenCategory.marginTop
          + stylesheet.mainScreenCategoryHeight.height;
      }
      else {
        position += productCardHeight
          + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/imageSidesRatio
          + stylesheet.mainScreenProductCardContainer.paddingVertical;
        if (data[i+1].name != undefined)
          i++;
      }
    }

    return position-1;
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
                translateCategoryName(ProductType.Rolls)
                : translateCategoryName(this.props.route.params.category)}
            />
            <RecyclerListView
              layoutProvider={this.layoutProvider}
              dataProvider={this.state.dataProvider}
              rowRenderer={this._rowRenderer}
              initialOffset={this.state.scrollOffset}
            />

        </View>
        </ImageBackground>
    );
  }
}

export function translateCategoryName(category){
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
