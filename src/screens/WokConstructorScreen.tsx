import React, {Component} from "react";
import {ScrollView, View} from "react-native";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import {ProductType} from "../entities/ProductType";
import Product from "../entities/Product";
import Ingredient from "../entities/Ingredient";
import WokCard from "../components/WokCard";

export interface IWokConstructorScreenState {
    products: Product[];
    ingredients: Map<string, Ingredient[]>;
}

class WokConstructorScreen extends Component<Readonly<any>, Readonly<IWokConstructorScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
            ingredients: new Map(),
        };
    }

    componentDidMount() {
        let products: Product[] | undefined;
        return RealtimeDatabaseApi.getProducts().then((data) => {
            products = data.get(ProductType.Wok);
            RealtimeDatabaseApi.getWokConstructorIngredients().then((ingredients) => {
                this.setState({
                    products: products ? products : [],
                    ingredients: ingredients,
                });
            });
        });
    }

    render() {
        const base = this.state.ingredients.get("base");
        const sauce = this.state.ingredients.get("souce");
        const cards = this.state.products?.map((value, i, array) => {
            return (
                <WokCard
                    key={i}
                    product={this.state.products[i]}
                    baseIngredients={base ? base : []}
                    sauceIngredients={sauce ? sauce : []}
                    style={i === array.length - 1 && {marginBottom: 20}}
                />
            );
        });
        return <ScrollView>{cards.length ? <View>{cards}</View> : null}</ScrollView>;
    }
}

export default WokConstructorScreen;
