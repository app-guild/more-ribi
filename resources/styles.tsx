import {StyleSheet} from "react-native";

const globalColors = {
    transparent: "transparent",
    primaryColor: "#779DB9",
    accentColor: "#E5E5E5",
    mainBackgroundColor: "#E5E5E5",
    navigatorBackgroundColor: "white",
    mainTextColor: "#000000",
    cardBackgroundColor: "#FFFFFF",
    whiteTextColor: "#FFFFFF",
    shadowColor: "#000000",
    additionalTextColor: "#CFD2D7",
    crossedOutPriceColor: "#A5A5A5",
    backgroundOverlay: "#efefef",
    headerUnderlineColor: "#FFC11E",
    categoriesScreenCardTitleContainerBGColor: "rgba(0,0,0,0.35)",
    orangeColor: "#ffc11e",
    unloadedCard: "lightgrey",
};

const globalStylesheet = StyleSheet.create({
    centerBody: {
        backgroundColor: globalColors.mainBackgroundColor,
        position: "relative",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    primaryText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
        color: globalColors.mainTextColor,
    },
    secondaryText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 10,
        lineHeight: 13,
        color: globalColors.additionalTextColor,
    },
    price: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        color: globalColors.primaryColor,
    },
    crossedOutPrice: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
        color: globalColors.crossedOutPriceColor,
        textDecorationLine: "line-through",
    },
});

export {globalColors, globalStylesheet};
