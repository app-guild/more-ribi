import React, {Component} from "react";
import {FlatList, Dimensions} from "react-native";
import {stylesheet} from "../../resources/styles";
import Header from "../components/Header";
import DishCard from "../components/DishCard";


export interface IMainScreenState {
  mainContainerWidth: number,
  cardsInfo: any[],
}

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {
  constructor(props: any) {
    super(props);
    this.state = {
      mainContainerWidth: Dimensions.get("window").width,
      cardsInfo: [
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
          price: 290,
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
        },
        {
          id: 5,
          name: "Поке с лососем 6",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
      ]
    };
  }

  render() {
    // @ts-ignore
    const renderItem = ({ item, index }) => (
      <DishCard
        width={(this.state.mainContainerWidth - 2*27 - 17)/2}
        name={item.name}
        composition={item.composition}
        price={item.price}
        style={{
          marginLeft: !(index%2) ? 27 : 17,
          marginRight: !(index%2) ? 0 : 27,
          marginTop: index > 1 ? 0 : 6,
          marginBottom: index > this.state.cardsInfo.length-3 ? 14 : 20,
        }}

      />
    );

    return (
      <>
        <Header
          navigation={this.props.navigation}
        />

        <FlatList
          data={this.state.cardsInfo}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          numColumns={2}
          style={stylesheet.mainScreenContainer}
        />
      </>
    );
  }
}

export default MainScreen;
