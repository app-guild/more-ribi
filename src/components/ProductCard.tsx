import React, {Component} from "react";
import {Image, Text, View, TouchableOpacity, StyleSheet} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import DatabaseApi from "../utils/database/DatabaseApi";
import Product from "../entities/Product";
import Cart from "../entities/Cart";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";

export interface IProductCardState {
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
            countInCart: 0,
        };
        this.addToCart = this.addToCart.bind(this);
        this.setCountInCart = this.setCountInCart.bind(this);
    }

    componentDidMount() {
        DatabaseApi.addOnCartChangeListener(this.setCountInCart);
        RealtimeDatabaseApi.addProductsChangedListener(this._onProductsChanged);
        return DatabaseApi.getCart().then(this.setCountInCart);
    }

    componentWillUnmount() {
        DatabaseApi.removeOnCartChangeListener(this.setCountInCart);
        RealtimeDatabaseApi.removeProductsChangedListener(this._onProductsChanged);
    }

    componentDidUpdate(prevProps: Readonly<Readonly<IProductCardProps>>) {
        if (prevProps.product !== this.props.product) {
            DatabaseApi.getCart().then(this.setCountInCart);
        }
    }

    private _onProductsChanged = (newProducts: Product[]) => {
        const currentProductInChanged = newProducts.find((it) => this.props.product.id === it.id);
        if (currentProductInChanged) {
            Object.assign(this.props.product, currentProductInChanged);
            this.forceUpdate();
        }
    };

    private setCountInCart(cart: Cart) {
        this.setState({countInCart: cart.getProductCount(this.props.product)});
    }

    private async addToCart() {
        if (this.state.countInCart === 0) {
            return DatabaseApi.addProductToCart(this.props.product);
        } else {
            return DatabaseApi.updateProductCount(this.props.product, this.state.countInCart + 1);
        }
    }

    private renderPrice(price: number, discountPrice?: number | null) {
        let result: any;
        let styleForMainPrice: object = stylesheet.shoppingCartMainPrice;
        if (this.state.countInCart > 0) {
            styleForMainPrice = stylesheet.shoppingCartMainPriceSelected;
        }
        let displayCountOfSelected = "";
        if (this.state.countInCart > 1) {
            displayCountOfSelected = `  X ${this.state.countInCart}`;
        }

        if (discountPrice || discountPrice === 0) {
            let mainPriceTextColor = globalColors.headerUnderlineColor;
            if (this.state.countInCart > 0) {
                mainPriceTextColor = globalColors.backgroundOverlay;
            }
            result = (
                <View style={stylesheet.shoppingCartPriceContainer}>
                    <Text
                        numberOfLines={1}
                        style={{
                            ...globalStylesheet.crossedOutPrice,
                            marginLeft: stylesheet.shoppingCartMainPrice.padding,
                        }}>
                        {price + " ₽"}
                    </Text>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={styleForMainPrice}>
                            <Text numberOfLines={1} style={{...globalStylesheet.price, color: mainPriceTextColor}}>
                                {discountPrice + " ₽" + displayCountOfSelected}
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
            result = (
                <View style={stylesheet.shoppingCartPriceContainer}>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={styleForMainPrice}>
                            <Text numberOfLines={1} style={{...globalStylesheet.price, color: mainPriceTextColor}}>
                                {price + " ₽" + displayCountOfSelected}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        }
        return result;
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
                                {this.renderPrice(product.price, product.discountPrice)}
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
