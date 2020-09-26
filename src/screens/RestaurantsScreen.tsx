import React, {Component} from "react";
import {View} from "react-native";
import YaMap, {Marker, Point} from "react-native-yamap";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import Restaurant from "../entities/Restaurant";

const CENTER_POSITION = {lon: 39.876635, lat: 57.624475};

export interface IRestaurantsScreenState {
    restaurants: Restaurant[];
}

class RestaurantsScreen extends Component<Readonly<any>, Readonly<IRestaurantsScreenState>> {
    private map = React.createRef<YaMap>();

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
        return this.state.restaurants
            .filter((it) => it && it.position)
            .map((restaurant, index) => {
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

    render() {
        const markers = this._getMarkers();
        return (
            <View style={{flex: 1}}>
                <YaMap ref={this.map} style={{flex: 1}}>
                    {markers}
                </YaMap>

            </View>
        );
    }
}

export default RestaurantsScreen;
