import React, {Component} from "react";
import {Dimensions, View} from "react-native";
import DishCard from "./DishCard";

export interface IPokeSubScreenState {
  cardsInfo: any[],
}

class PokeSubScreen extends Component<Readonly<any>, Readonly<IPokeSubScreenState>> {
  constructor(props: any) {
    super(props);
    this.state = {
      cardsInfo: [
        {
          name: "Поке с лососем",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
        {
          name: "Поке с лососем",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
        {
          name: "Поке с лососем",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
        {
          name: "Поке с лососем",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
        {
          name: "Поке с лососем",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
        {
          name: "Поке с лососем",
          composition: "Рис, лосось, авокадо, красный лук, салат, морковь",
          price: 290,
        },
      ]
    };
  }

  render() {
    return (
      // style={stylesheet.centerBody}
      <View style={{padding: 20, flexDirection: "row"}}>
        <DishCard
          width={Dimensions.get("window").width/2-20-20/2}
          name={this.state.cardsInfo[0].name}
          composition={this.state.cardsInfo[0].composition}
          price= {this.state.cardsInfo[0].price}
        />
        <DishCard
          width={Dimensions.get("window").width/2-20-20/2}
          name={this.state.cardsInfo[0].name}
          composition={this.state.cardsInfo[0].composition}
          price= {this.state.cardsInfo[0].price}
          style={{marginLeft: 20}}
        />
      </View>
    );
  }
}

export default PokeSubScreen;
