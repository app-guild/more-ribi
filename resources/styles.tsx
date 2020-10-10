import {StyleSheet} from "react-native";

const globalColors = {
    transparent: "transparent",
    primaryColor: "#779DB9",
    fadePrimaryColor: "#D1DAE2",
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
    almostTransparent: "rgba(255, 255, 255, 0.0001)",
};

const globalStylesheet = StyleSheet.create({
    centerBody: {
        backgroundColor: globalColors.mainBackgroundColor,
        position: "relative",
        height: "100%",
        display: "flex",
        flex: 1,
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
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        color: globalColors.primaryColor,
    },
    crossedOutPrice: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
        color: globalColors.crossedOutPriceColor,
        textDecorationLine: "line-through",
    },
    headerContainer: {
        paddingVertical: 24,
        paddingHorizontal: 26,
    },
    header: {
        flexDirection: "row",
        justifyContent: "center",
    },
    headerText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 18,
        lineHeight: 23,
        color: globalColors.primaryColor,
    },
    headerFishBackButton: {
        position: "absolute",
        left: 0,
    },
});

export {globalColors, globalStylesheet};
