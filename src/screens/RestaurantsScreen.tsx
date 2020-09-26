import React, {Component} from "react";
import {View} from "react-native";
import YaMap from "react-native-yamap";

const CENTER_POSITION = {lon: 39.876635, lat: 57.624475};
const ZOOM = 13;

export interface IRestaurantsScreenState {}

class RestaurantsScreen extends Component<Readonly<any>, Readonly<IRestaurantsScreenState>> {
    private map = React.createRef<YaMap>();

    constructor(props: any) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this.map.current?.setCenter(CENTER_POSITION, ZOOM);
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <YaMap
                    ref={this.map}
                    style={{flex: 1}}
                />
            </View>
        );
    }
}

export default RestaurantsScreen;
