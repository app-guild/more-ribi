import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import Product from "../entities/Product";
import Cart from "../entities/Cart";

export interface IProductCardState {
    product: Product;
    countInCart: number;
}

export interface IProductCardProps {
    product: Product;
    onClick: (product: Product) => any;
}

class ProductCard extends Component<Readonly<IProductCardProps>, Readonly<IProductCardState>> {
    constructor(props: IProductCardProps) {
        super(props);
        this.state = {
            product: props.product,
            countInCart: 0,
        };
        this.addToCart = this.addToCart.bind(this);
        this.getCountInCart = this.getCountInCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.getCountInCart);
        return DatabaseApi.getCart().then(this.getCountInCart);
    }

    componentWillUnmount() {
        DatabaseApi.removeOnCartChangeListener(this.getCountInCart);
    }

    private getCountInCart(cart: Cart) {
        const thisProducts = cart.products.filter((prod) => prod.id === this.state.product.id);
        this.setState({countInCart: thisProducts.length});
    }

    private async addToCart() {
        return DatabaseApi.addProductToCart(this.state.product.id);
    }

    render() {
        const {product, onClick} = this.props;
        const image =
            product.imageUrl?.length > 0
                ? {uri: product.imageUrl}
                : require("../../resources/assets/drawable/food.jpg");
        let price: any;
        let styleForMainPrice = stylesheet.shoppingCartMainPrice;
        if (this.state.countInCart > 0) {
            styleForMainPrice = stylesheet.shoppingCartMainPriceSelected;
        }
        let displayCountOfSelected = "";
        if (this.state.countInCart > 1) {
            displayCountOfSelected = `  X ${this.state.countInCart}`;
        }

        if (product.discountPrice) {
            let mainPriceTextColor = globalColors.headerUnderlineColor;
            if (this.state.countInCart > 0) {
                mainPriceTextColor = globalColors.backgroundOverlay;
            }
            price = (
                <View style={stylesheet.shoppingCartPriceContainer}>
                    <Text
                        numberOfLines={1}
                        style={{
                            ...globalStylesheet.crossedOutPrice,
                            marginLeft: stylesheet.shoppingCartMainPrice.padding,
                        }}>
                        {product.price + " ₽"}
                    </Text>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={styleForMainPrice}>
                            <Text numberOfLines={1} style={{...globalStylesheet.price, color: mainPriceTextColor}}>
                                {product.discountPrice + " ₽" + displayCountOfSelected}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        } else {
            let mainPriceTextColor = globalColors.crossedOutPriceColor;
            if (this.state.countInCart > 0) {
                mainPriceTextColor = globalColors.backgroundOverlay;
            }
            price = (
                <View style={stylesheet.shoppingCartPriceContainer}>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={styleForMainPrice}>
                            <Text numberOfLines={1} style={{...globalStylesheet.price, color: mainPriceTextColor}}>
                                {product.price + " ₽" + displayCountOfSelected}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }

        return (
            <View style={stylesheet.container}>
                <View
                    style={{flexDirection: "row"}}
                    onTouchEnd={() => {
                        onClick(product);
                    }}>
                    <View style={stylesheet.shoppingCartImageContainer} >
                        <Image source={image} style={stylesheet.shoppingCartImage} />
                    </View>
                    <View style={stylesheet.shoppingCardTextContainer}>
                        <Text numberOfLines={2} style={globalStylesheet.primaryText}>
                            {product.name}
                        </Text>
                        <Text numberOfLines={3} style={{...globalStylesheet.secondaryText, marginTop: 10}}>
                            {product.composition}
                        </Text>
                    </View>
                </View>
                <View style={stylesheet.shoppingCartButtonContainer}>
                    <TouchableOpacity activeOpacity={0.85} onPress={this.addToCart}>
                        {price}
                    </TouchableOpacity>
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
    shoppingCardTextContainer: {
        marginHorizontal: 10,
        flexDirection: "column",
        justifyContent: "flex-start",
        width: "30%",
    },
    shoppingCartButtonContainer: {
        justifyContent: "center",
        alignItems: "flex-end",
        width: "30%",
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
    shoppingCartPriceContainer: {
        marginRight: 10,
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        width: "100%",
    },
    shoppingCartMainPrice: {
        borderColor: globalColors.accentColor,
        borderWidth: 1,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        width: "100%",
    },
    shoppingCartMainPriceSelected: {
        backgroundColor: globalColors.headerUnderlineColor,
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        width: "100%",
    },
});

export default ProductCard;
