import React, {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import {globalColors, globalStylesheet} from "../../resources/styles";
import Product from "../entities/Product";
import NumericInput from "react-native-numeric-input";
import DatabaseApi from "../utils/database/DatabaseApi";
import CloseIcon from "../../resources/assets/drawable/cross_icon.svg";

export interface ICartItemState {
    productCount: number;
}

export interface ICartItemProps {
    product: Product;
}

const CLOSE_ICON_SIZE = 15;

class CartItem extends Component<Readonly<ICartItemProps>, Readonly<ICartItemState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            productCount: 1,
        };
    }

    componentDidMount() {
        const product = this.props.product;
        if (product) {
            return DatabaseApi.getCart().then((cart) => {
                this.setState({productCount: cart.getProductCount(product)});
            });
        }
        return;
    }

    private async updateProductCount(product: Product, count: number) {
        return new Promise<void>((resolve) => {
            if (this.state.productCount > 0 && count > 0) {
                resolve(DatabaseApi.updateProductCount(product, count));
            } else if (this.state.productCount === 0) {
                resolve(DatabaseApi.addProductToCart(product, count));
            } else if (count === 0) {
                resolve(DatabaseApi.removeProductFromCart(product));
            }
        }).then(() => {
            this.setState({productCount: count});
        });
    }

    render() {
        const {product} = this.props;
        let price = product.discountPrice === undefined ? product.price : product.discountPrice;
        const textPrice = price + " ₽";

        return (
            <View style={stylesheet.container}>
                <Text style={stylesheet.column}>{this.props.product.name}</Text>
                <NumericInput
                    containerStyle={{
                        ...stylesheet.column,
                        flex: 0.9,
                        borderColor: globalColors.fadePrimaryColor,
                        borderRadius: 20,
                        backgroundColor: globalColors.fadePrimaryColor,
                    }}
                    inputStyle={{
                        borderColor: globalColors.fadePrimaryColor,
                    }}
                    iconStyle={{
                        color: globalColors.cardBackgroundColor,
                    }}
                    leftButtonBackgroundColor={globalColors.fadePrimaryColor}
                    rightButtonBackgroundColor={globalColors.fadePrimaryColor}
                    textColor={globalColors.cardBackgroundColor}
                    minValue={0}
                    rounded={true}
                    initValue={this.state.productCount}
                    onChange={async (value) => {
                        if (value !== this.state.productCount) {
                            return this.updateProductCount(product, value);
                        }
                        return;
                    }}
                />
                <View style={{...stylesheet.column, justifyContent: "flex-end"}}>
                    <Text style={{...globalStylesheet.price, marginHorizontal: 10}}>{textPrice}</Text>
                    <View>
                        <CloseIcon
                            width={CLOSE_ICON_SIZE}
                            height={CLOSE_ICON_SIZE}
                            onTouchEnd={() => this.updateProductCount(product, 0)}
                        />
                    </View>
                </View>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginVertical: 5,
        marginHorizontal: 10,
    },
    column: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
    productName: {
        ...globalStylesheet.primaryText,
        fontSize: 12,
    },
});

export default CartItem;
