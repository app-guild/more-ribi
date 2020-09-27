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

const CLOSE_ICON_SIZE = 10;

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
            DatabaseApi.getCart().then((cart) => {
                this.setState({productCount: cart.getProductCount(product)});
            });
        }
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
            return;
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
                <Text>Promotions Screen</Text>
                <View style={stylesheet.controlContainer}>
                    <NumericInput
                        containerStyle={{
                            borderColor: globalColors.transparent,
                        }}
                        inputStyle={{
                            borderColor: globalColors.transparent,
                        }}
                        iconStyle={{
                            color: globalColors.mainBackgroundColor,
                        }}
                        leftButtonBackgroundColor={globalColors.primaryColor}
                        rightButtonBackgroundColor={globalColors.primaryColor}
                        textColor={globalColors.primaryColor}
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
                    <Text style={globalStylesheet.price}>{textPrice}</Text>
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
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
    },
    controlContainer: {
        justifyContent: "flex-end",
        alignItems: "center",
        flexDirection: "row",
    },
    productName: {
        ...globalStylesheet.primaryText,
        fontSize: 12,
    },
});

export default CartItem;