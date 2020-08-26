import React, {Component} from "react";
import {Dimensions, View, ImageBackground} from "react-native";
import {globals, stylesheet} from "../../resources/styles";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";



export interface IMainScreenState {
  mainContainerWidth: number,
  productCardWidth: number,
  dataProvider: any,
}

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {

  constructor(props: any) {
    super(props);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      productCardWidth: (Dimensions.get("window").width - 2*27 - 17)/2,
      dataProvider: new DataProvider((r1, r2) => {
        return r1.id !== r2.id;
      }).cloneWithRows(
        [
          {
            id: 0,
            name: "Поке с лососем",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
          },
          {
            id: 1,
            name: "Поке с лососем 2",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 999.999,
            crossOutPrice: 1000,
          },
          {
            id: 2,
            name: "Поке с лососем 3",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
          },
          {
            id: 3,
            name: "Поке с лососем 4",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
          },
          {
            id: 4,
            name: "Поке с лососем 5",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
            crossOutPrice: 10000,
          },
          {
            id: 5,
            name: "Поке с лососем 6",
            composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
            price: 290,
          },
        ]),
    };


    this._rowRenderer = this._rowRenderer.bind(this);
  }

  _rowRenderer(type: any, data: any) {
    switch (type) {
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
    // const renderItem = ({ item, index }) => (
    //   <ProductCard
    //     width={(this.state.mainContainerWidth - 2*27 - 17)/2}
    //     name={item.name}
    //     composition={item.composition}
    //     price={item.price}
    //     crossOutPrice={item.crossOutPrice}
    //     style={{
    //       marginLeft: !(index%2) ? 27 : 17,
    //       marginRight: !(index%2) ? 0 : 27,
    //       marginTop: index > 1 ? 0 : 6,
    //       marginBottom: index > this.state.cardsInfo.length-3 ? 14 : 20,
    //     }}
    //
    //   />
    // );
    return (
        <ImageBackground
          source={require("../../resources/assets/drawable/background.png")}
          style={{flex: 1}}
        >
          <View style={{backgroundColor: globals.backgroundOverlay, flex: 1}}>

            <Header
              navigation={this.props.navigation}
            />

            <RecyclerListView
              layoutProvider={new LayoutProvider(
                index => {return index%2},
                (type, dim) => {
                  switch (type) {
                    case 0:
                      dim.width = this.state.mainContainerWidth / 2 - 0.0001;
                      dim.height = 111
                        + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/1.2
                        + stylesheet.mainScreenProductCardContainer.paddingVertical
                      break;
                    case 1:
                      dim.width = this.state.mainContainerWidth / 2;
                      dim.height = 111
                        + (this.state.productCardWidth-2*stylesheet.productCardContainer.padding)/1.2
                        + stylesheet.mainScreenProductCardContainer.paddingVertical
                      break;
                  }
                }
              )}
              dataProvider={this.state.dataProvider}
              rowRenderer={this._rowRenderer}
            />

        </View>
        </ImageBackground>
    );
  }
}

export default MainScreen;
