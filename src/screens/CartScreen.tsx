import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import Cart from "../entities/Cart";
import FishIcon from "../../resources/assets/drawable/fish_back_button.svg";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import CartItem from "../components/CartItem";
import Product from "../entities/Product";
import {TouchableOpacity} from "react-native-gesture-handler";

const FISH_ICON_BACK_SIZE = {width: 47, height: 17};

export interface ICartScreenState {
    products: Product[];
}

class CartScreen extends Component<Readonly<any>, Readonly<ICartScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            products: [],
        };
        this.updateProducts = this.updateProducts.bind(this);
    }

    componentDidMount() {
        return DatabaseApi.getCart()
            .then(this.updateProducts)
            .then(() => DatabaseApi.addOnCartChangeListener(this.updateProducts));
    }

    componentWillUnmount() {
        return DatabaseApi.removeOnCartChangeListener(this.updateProducts);
    }

    private updateProducts(cart: Cart) {
        this.setState({products: cart.products});
    }

    // @ts-ignore
    private renderItem({item}) {
        if (item instanceof Product) {
            return <CartItem product={item} />;
        } else {
            return <View />;
        }
    }

    render() {
        return (
            <View style={stylesheet.container}>
                <View style={globalStylesheet.headerContainer}>
                    <View style={globalStylesheet.header}>
                        <FishIcon
                            width={FISH_ICON_BACK_SIZE.width}
                            height={FISH_ICON_BACK_SIZE.height}
                            style={globalStylesheet.headerFishBackButton}
                            onTouchEnd={() => this.props.navigation.goBack()}
                        />
                        <Text style={globalStylesheet.headerText}>Ваш улов:</Text>
                    </View>
                </View>
                <View style={stylesheet.bodyContainer}>
                    <FlatList data={this.state.products} renderItem={this.renderItem} />
                    <TouchableOpacity style={stylesheet.orderButton}>
                        <Text style={stylesheet.orderButtonText}>Оформить заказ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        flex: 1,
    },
    bodyContainer: {
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    orderButton: {
        width: "100%",
        paddingVertical: 22,
        alignItems: "center",
        justifyContent: "center",
        borderTopRightRadius: 9,
        borderTopLeftRadius: 9,
    },
    orderButtonText: {
        ...globalStylesheet.headerText,
        color: globalColors.mainBackgroundColor,
    },
});

export default CartScreen;
