import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import Product from "../entities/Product";
import Cart from "../entities/Cart";
import renderPrice from "./PriceButton";

export interface IProductCardState {
    countInCart: number;
}

export interface IProductCardProps {
    product: Product;
    countInCart: number;
    onClick: (product: Product) => any;
}

class ProductCard<P extends IProductCardProps, S extends IProductCardState> extends Component<P, S> {
    constructor(props: P) {
        super(props);
        this.state = {
            countInCart: props.countInCart,
        };
        this.addToCart = this.addToCart.bind(this);
        this.setCountInCart = this.setCountInCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.setCountInCart);
        return DatabaseApi.getCart().then(this.setCountInCart);
    }

    componentWillUnmount() {
        DatabaseApi.removeOnCartChangeListener(this.setCountInCart);
    }

    componentDidUpdate(prevProps: Readonly<P>) {
        if (prevProps.product !== this.props.product) {
            DatabaseApi.getCart().then(this.setCountInCart);
        }
    }

    protected setCountInCart(cart: Cart) {
        this.setState({countInCart: cart.getProductCount(this.props.product)});
    }

    protected async addToCart() {
        if (this.state.countInCart === 0) {
            return DatabaseApi.addProductToCart(this.props.product);
        } else {
            return DatabaseApi.updateProductCount(this.props.product, this.state.countInCart + 1);
        }
    }

    render() {
        const {product, onClick} = this.props;
        const image = product.image ? {uri: product.image} : require("../../resources/assets/drawable/food.jpg");

        return (
            <View style={stylesheet.container}>
                <View
                    style={stylesheet.shoppingCartImageContainer}
                    onTouchEnd={() => {
                        onClick(product);
                    }}>
                    <Image source={image} style={stylesheet.shoppingCartImage} />
                </View>
                <View style={stylesheet.shoppingCardMainContainer}>
                    <Text
                        numberOfLines={1}
                        style={{...globalStylesheet.primaryText, marginRight: 15}}
                        onPress={() => {
                            onClick(product);
                        }}>
                        {product.name}
                    </Text>
                    <View style={stylesheet.shoppingCardSubContainer}>
                        <Text
                            numberOfLines={2}
                            style={stylesheet.shoppingCardCompositionText}
                            onPress={() => {
                                onClick(product);
                            }}>
                            {product.composition}
                        </Text>
                        <View style={stylesheet.shoppingCartButtonContainer}>
                            <TouchableOpacity activeOpacity={0.85} onPress={this.addToCart}>
                                {renderPrice(product.price, this.state.countInCart, product.discountPrice)}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

export const stylesheet = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: globalColors.transparent,
        borderBottomColor: globalColors.accentColor,
        marginHorizontal: 10,
        padding: 10,
        justifyContent: "space-between",
        flexDirection: "row",
        width: "95%",
        height: "100%",
    },
    shoppingCardMainContainer: {
        marginHorizontal: 10,
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "70%",
        position: "relative",
    },
    shoppingCardSubContainer: {
        alignContent: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
    },
    shoppingCardCompositionText: {
        ...globalStylesheet.secondaryText,
        marginVertical: 10,
        width: "50%",
    },
    shoppingCartButtonContainer: {
        justifyContent: "center",
        alignItems: "flex-end",
        width: "40%",
    },
    shoppingCartImageContainer: {
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
    },
    shoppingCartImage: {
        height: "100%",
        aspectRatio: 1,
        borderRadius: 20,
    },
});

export default ProductCard;
