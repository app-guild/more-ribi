import React, {Component} from "react";
import {Text, View, FlatList, StyleSheet, StatusBar, Dimensions, ScrollView} from "react-native";
import {stylesheet} from "../../resources/styles";
import Header from "../components/Header";
import DishCard from "../components/DishCard";

export interface IMainScreenState {
    mainContainerWidth: number,
    mainContainerHeight: number,
    cardsInfo: any[],
}

class MainScreen extends Component<Readonly<any>, Readonly<IMainScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            mainContainerWidth: Dimensions.get("window").width,
            mainContainerHeight: 1000,//Dimensions.get("window").height
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
        //const Tab = createMaterialTopTabNavigator();
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
              <Header/>
                  <FlatList
                    data={this.state.cardsInfo}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    numColumns={2}
                    style={{
                        ...stylesheet.mainScreenContainer,
                        //height: this.state.mainContainerHeight
                    }}
                  />
          </>
        );
    }
}

function HomeScreen({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Home!</Text>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
});
export default MainScreen;
