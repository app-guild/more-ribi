import React, {Component} from "react";
import {Dimensions, FlatList, Image, ImageBackground, Text, View} from "react-native";
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
          name: "Поке от шефа",
        },
        {
          id: 1,
          name: "Супы",
        },
        {
          id: 2,
          name: "Роллы",
        },
        {
          id: 4,
          name: "Вок",
        },
      ]
    };
  }

  render() {
    const renderItem = ({ item, index }) => (
      <CategoryCard
        size={(this.state.mainContainerWidth -2*stylesheet.categoriesScreenContainer.paddingHorizontal - 10)/2}
        name={item.name}
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
              <FishIcon width={47} height={17} style={stylesheet.headerFishBackButton}/>
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
