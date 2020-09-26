import React, {Component} from "react";
import {View, Button, ScrollView} from "react-native";
import YaMap, {Marker, Point} from "react-native-yamap";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Restaurant from "../entities/Restaurant";
import SlidingUpPanel from "rn-sliding-up-panel";
import RestaurantCard from "../components/RestaurantCard";
import {Divider} from "react-native-paper";

const CENTER_POSITION = {lon: 39.876635, lat: 57.624475};

export interface IRestaurantsScreenState {
    restaurants: Restaurant[];
}

class RestaurantsScreen extends Component<Readonly<any>, Readonly<IRestaurantsScreenState>> {
    private map = React.createRef<YaMap>();
    private panel = React.createRef<SlidingUpPanel>();

    constructor(props: any) {
        super(props);
        this.state = {restaurants: []};
    }

    componentDidMount() {
        this.map.current?.setCenter(CENTER_POSITION, 13);
        return RealtimeDatabaseApi.getRestaurants().then((restaurants) => {
            this.setState({restaurants});
        });
    }

    componentDidUpdate(prevProps: Readonly<Readonly<any>>) {
        if (this.state?.restaurants !== prevProps.state?.restaurants) {
            this.map.current?.fitAllMarkers();
        }
    }

    private _onPressMarker = (position: Point) => {
        this.map.current?.setCenter(position, 17);
    };

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
                    source={require("../../resources/assets/drawable/marker.png")}
                    scale={0.2}
                    anchor={{x: 0.7, y: 0.9}}
                    onPress={() => this._onPressMarker(point)}
                />
            );
        });
    }

    private _getRestaurantCards(): JSX.Element[] {
        return this.state.restaurants.map((restaurant, index) => {
            return (
                <>
                    <RestaurantCard key={index} restaurant={restaurant} />
                    <Divider />
                </>
            );
        });
    }

    render() {
        const markers = this._getMarkers();
        const restaurantCards = this._getRestaurantCards();
        return (
            <View style={{flex: 1}}>
                <YaMap ref={this.map} style={{flex: 2}}>
                    {markers}
                </YaMap>
                <ScrollView
                    style={{
                        flex: 1,
                        backgroundColor: "#FFFFFF",
                    }}>
                    <Divider />
                    {restaurantCards}
                </ScrollView>
            </View>
        );
    }
}

export default RestaurantsScreen;
