import {globalColors, globalStylesheet} from "../../resources/styles";
import {StyleSheet, Text, View} from "react-native";
import React from "react";

export interface IPriceButtonProps {
    price: number;
    countInCart: number;
    discountPrice?: number | null;
}

export default function PriceButton(props: IPriceButtonProps) {
    let result: any;
    const {price, countInCart, discountPrice} = props;
    let styleForMainPrice = stylesheet.shoppingCartMainPrice;
    if (countInCart > 0) {
        styleForMainPrice = stylesheet.shoppingCartMainPriceSelected;
    }
    let displayCountOfSelected = "";
    if (countInCart > 1) {
        displayCountOfSelected = `  X ${countInCart}`;
    }

    if (discountPrice || discountPrice === 0) {
        let mainPriceTextColor = globalColors.headerUnderlineColor;
        if (countInCart > 0) {
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
        if (countInCart > 0) {
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

const stylesheet = StyleSheet.create({
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
        borderWidth: 1,
        borderColor: "transparent",
        borderTopLeftRadius: 10,
        borderBottomRightRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 5,
        width: "100%",
    },
});
