import React, {Component} from "react";
import {Dimensions, FlatList, ImageBackground, Text, View} from "react-native";
import {stylesheet} from "../../resources/styles";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg"
import CategoryCard from "../components/CategoryCard";


export interface ICategoriesScreenState {
  mainContainerWidth: number,
  cardsInfo: any[],
}

class CategoriesScreen extends Component<
  Readonly<any>,
  Readonly<ICategoriesScreenState>
  > {
  constructor(props: any) {
    super(props);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      cardsInfo: [
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
      ]
    };
  }

  render() {
    const renderItem = ({ item, index }) => (
      <CategoryCard
        size={(this.state.mainContainerWidth
          -2*stylesheet.categoriesScreenContainer.paddingHorizontal
          -stylesheet.categoriesScreenMargin.margin)/2}
        text={item.text}
        onTouchEnd={()=>this.props.navigation.navigate("Main",{
          category: item.text,
        })}
        style={{
          marginLeft: index%2?stylesheet.categoriesScreenMargin.margin:0,
          marginBottom: stylesheet.categoriesScreenMargin.margin,
        }}
      />
    );
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

          <FlatList
            data={this.state.cardsInfo}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={2}
          />
        </View>
      </ImageBackground>
    );
  }
}

export default CategoriesScreen;
