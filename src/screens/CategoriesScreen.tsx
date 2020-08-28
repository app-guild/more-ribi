import React, {Component} from "react";
import {Dimensions, FlatList, ImageBackground, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg"
import CategoryCard from "../components/CategoryCard";
import {DataProvider, LayoutProvider, RecyclerListView} from "recyclerlistview";
import ProductCard from "../components/ProductCard";


export interface ICategoriesScreenState {
  mainContainerWidth: number,
  dataProvider: any,
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
        return r1.id !== r2.id;
      }).cloneWithRows(
        [
          {
            id: 0,
            text: "Поке от шефа",
          },
          {
            id: 1,
            text: "Супы",
          },
          {
            id: 2,
            text: "Роллы",
          },
          {
            id: 4,
            text: "Вок",
          },
          {
            id: 5,
            text: "Роллы",
          },
          {
            id: 6,
            text: "Вок",
          },
          {
            id: 7,
            text: "Роллы",
          },
          {
            id: 8,
            text: "Вок",
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
          dim.width = this.state.mainContainerWidth / 2 - 0.0001;
          dim.height = (this.state.mainContainerWidth
            -2*stylesheet.categoriesScreenContainerPadding.padding
            -stylesheet.categoriesScreenColumnMargin.margin)/2
            +stylesheet.categoriesScreenColumnMargin.margin;
          break;
        case 1:
          dim.width = this.state.mainContainerWidth / 2;
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
                category: data.text,
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
                category: data.text,
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
