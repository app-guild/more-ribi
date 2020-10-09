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
    additionalTextColor: "#909193",
    crossedOutPriceColor: "#A5A5A5",
    backgroundOverlay: "#efefef",
    headerUnderlineColor: "#FFC11E",
    categoriesScreenCardTitleContainerBGColor: "rgba(0,0,0,0.35)",
    orangeColor: "#ffc11e",
    unloadedCard: "lightgrey",
    redBlinkColor: "rgba(255, 0, 0, 0.35)",
    aboutUsBackground: "#009966",
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
        fontFamily: "Muli-Bold",
        fontSize: 14,
        lineHeight: 18,
        color: globalColors.mainTextColor,
    },
    secondaryText: {
        fontFamily: "Muli",
        fontSize: 10,
        lineHeight: 13,
        color: globalColors.additionalTextColor,
    },
    price: {
        fontFamily: "Muli",
        fontSize: 14,
        color: globalColors.primaryColor,
    },
    crossedOutPrice: {
        fontFamily: "Muli",
        fontSize: 12,
        color: globalColors.crossedOutPriceColor,
        textDecorationLine: "line-through",
    },
});

export {globalColors, globalStylesheet};
