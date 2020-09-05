import React, {Component} from "react";
import {Dimensions, ImageBackground, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg"
import CategoryCard from "../components/CategoryCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import {translateCategoryName} from "./MainScreen";
import {ProductType} from "../entities/ProductType";


export interface ICategoriesScreenState {
  mainContainerWidth: number,
  dataProvider: DataProvider,
}

class CategoriesScreen extends Component<
  Readonly<any>,
  Readonly<ICategoriesScreenState>
  > {
  constructor(props: any) {
    super(props);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      dataProvider: new DataProvider((r1, r2) => {
        return r1.value !== r2.value;
      }).cloneWithRows([
        {
          text: translateCategoryName(ProductType.Rolls),
          value: ProductType.Rolls
        },
        {
          text: translateCategoryName(ProductType.Poke),
          value: ProductType.Poke
        },
        {
          text: translateCategoryName(ProductType.Wok),
          value: ProductType.Wok
        },
        {
          text: translateCategoryName(ProductType.Beverages),
          value: ProductType.Beverages
        },
        {
          text: translateCategoryName(ProductType.Deserts),
          value: ProductType.Deserts
        },
        {
          text: translateCategoryName(ProductType.Soups),
          value: ProductType.Soups
        },
      ]),
    };
    this._rowRenderer = this._rowRenderer.bind(this);
  }

  private layoutProvider = new LayoutProvider(
    index => {return index%2},
    (type, dim) => {
      switch (type) {
        case 0:
        case 1:
          dim.width = this.state.mainContainerWidth / 2 - 0.0001;
          dim.height = (this.state.mainContainerWidth
            -2*stylesheet.categoriesScreenContainerPadding.padding
            -stylesheet.categoriesScreenColumnMargin.margin)/2
            +stylesheet.categoriesScreenColumnMargin.margin;
          break;
      }
    }
  )

  _rowRenderer(type: any, data: any) {
    switch (type) {
      case 0:
        return (
          <View style={{
            marginLeft: stylesheet.categoriesScreenContainerPadding.padding,
          }}>
            <CategoryCard
              size={(this.state.mainContainerWidth
                -2*stylesheet.categoriesScreenContainerPadding.padding
                -stylesheet.categoriesScreenColumnMargin.margin)/2}
              text={data.text}
              onTouchEnd={()=>this.props.navigation.navigate("Main",{
                category: data.value,
              })}
            />
          </View>

        );
      case 1:
        return(
          <View style={{
            alignItems: "flex-end",
            marginRight: stylesheet.categoriesScreenContainerPadding.padding
          }}>
            <CategoryCard
              size={(this.state.mainContainerWidth
                -2*stylesheet.categoriesScreenContainerPadding.padding
                -stylesheet.categoriesScreenColumnMargin.margin)/2}
              text={data.text}
              onTouchEnd={()=>this.props.navigation.navigate("Main",{
                category: data.value,
              })}
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
        <View style={stylesheet.categoriesScreenContainer}>
          <View style={stylesheet.categoriesScreenHeaderContainer}>
            <View style={stylesheet.categoriesScreenHeader}>
              <FishIcon width={47} height={17} style={stylesheet.headerFishBackButton} onTouchEnd={()=>this.props.navigation.goBack()}/>
              <Text style={stylesheet.categoriesScreenHeaderText}>Разделы</Text>
            </View>
          </View>

          <RecyclerListView
            layoutProvider={this.layoutProvider}
            dataProvider={this.state.dataProvider}
            rowRenderer={this._rowRenderer}
          />
        </View>
      </ImageBackground>
    );
  }
}

export default CategoriesScreen;
