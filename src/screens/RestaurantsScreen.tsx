import React, {Component} from "react";
import {View, ScrollView, StyleSheet} from "react-native";
import YaMap, {Marker} from "react-native-yamap";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Restaurant from "../entities/Restaurant";
import RestaurantCard, {HEIGHT as CARD_HEIGHT} from "../components/RestaurantCard";
import {Divider} from "react-native-paper";

const CENTER_POSITION = {lon: 39.876635, lat: 57.624475, zoom: 13};

export interface IRestaurantsScreenState {
    restaurants: Restaurant[];
}

class RestaurantsScreen extends Component<Readonly<any>, Readonly<IRestaurantsScreenState>> {
    private map = React.createRef<YaMap>();
    private scroll = React.createRef<ScrollView>();
    private restaurantCards: Array<RestaurantCard | null> = [];

    constructor(props: any) {
        super(props);
        this.state = {restaurants: []};
    }

    componentDidMount() {
        this.map.current?.setCenter(CENTER_POSITION);
        return RealtimeDatabaseApi.getRestaurants().then((restaurants) => {
            this.setState({restaurants});
        });
    }

    componentDidUpdate(prevProps: Readonly<Readonly<any>>) {
        if (this.state?.restaurants !== prevProps.state?.restaurants) {
            this.map.current?.fitAllMarkers();
        }
    }

    private _onPressMarker = (restaurant: Restaurant) => {
        this._centerOnRestaurant(restaurant);

        const restaurantCard = this.restaurantCards.find((card) => card?.props?.restaurant === restaurant);
        if (restaurantCard) {
            this._scrollToRestaurant(restaurantCard);
            setTimeout(() => restaurantCard.blink(), 250);
        }
    };

    private _onPressCard = (restaurant: Restaurant) => {
        this._centerOnRestaurant(restaurant);
    };

    private _centerOnRestaurant(restaurant: Restaurant) {
        const point = {
            lat: restaurant.position.latitude,
            lon: restaurant.position.longitude,
            zoom: 17,
        };
        this.map.current?.setCenter(point);
    }

    private _scrollToRestaurant(restaurantCard: RestaurantCard) {
        const index = this.restaurantCards.indexOf(restaurantCard);
        if (index !== -1) {
            this.scroll.current?.scrollTo({y: CARD_HEIGHT * index});
        }
    }

    private _getMarkers(): JSX.Element[] {
        return this.state.restaurants.map((restaurant, index) => {
            const point = {
                lat: restaurant.position.latitude,
                lon: restaurant.position.longitude,
            };
            return (
                <Marker
                    key={index}
                    point={point}
                    source={require("../../resources/assets/drawable/map_marker.png")}
                    scale={0.2}
                    anchor={{x: 0.7, y: 0.9}}
                    onPress={() => this._onPressMarker(restaurant)}
                />
            );
        });
    }

    private _getRestaurantCards(): JSX.Element[] {
        const cards = this.state.restaurants.map((restaurant, index) => {
            return (
                <View key={index}>
                    <RestaurantCard
                        ref={(ref) => (this.restaurantCards[index] = ref)}
                        restaurant={restaurant}
                        onPress={() => this._onPressCard(restaurant)}
                    />
                    <Divider />
                </View>
            );
        });
        cards.unshift(<Divider key={-1} />);
        return cards;
    }

    render() {
        const markers = this._getMarkers();
        const restaurantCards = this._getRestaurantCards();
        return (
            <View style={{flex: 1}}>
                <YaMap ref={this.map} style={{flex: 2}}>
                    {markers}
                </YaMap>
                <ScrollView ref={this.scroll} style={stylesheet.scroll}>
                    {restaurantCards}
                </ScrollView>
            </View>
        );
    }
}

export default RestaurantsScreen;

const stylesheet = StyleSheet.create({
    scroll: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
});
