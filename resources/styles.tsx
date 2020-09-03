import {StyleSheet} from "react-native";

const globals = {
    primaryColor: "#779DB9",
    accentColor: "#E5E5E5",
    mainBackgroundColor: "#E5E5E5",
    navigatorBackgroundColor: "white",
    mainTextColor: "#000000",
    cardBackgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    additionalTextColor: "#CFD2D7",
    crossedOutPriceColor: "#A5A5A5",
    shoppingCartColor: "#909090",
    backgroundOverlay: "#FFFFFF",
    headerUnderlineColor: "#FFC11E"
};

const stylesheet = StyleSheet.create({
    centerBody: {
        backgroundColor: globals.mainBackgroundColor,
        position: "relative",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingBottom: 20,
    },
    body: {
        backgroundColor: globals.mainBackgroundColor,
        position: "relative",
        height: "100%",
        paddingHorizontal: 42,
        paddingVertical: 24,
        display: "flex",
    },
    textInput: {
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: 30,
        fontSize: 18,
        marginHorizontal: 20,
        color: globals.mainTextColor,
    },
    text: {
        position: "relative",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 14,
        color: globals.mainTextColor,
    },
    accentText: {
        position: "relative",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 12,
        color: globals.accentColor,
    },
    bottomNavigator: {
        height: 66,
        backgroundColor: globals.navigatorBackgroundColor,
        paddingBottom: 10,
    },
    headerContainer: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    headerTitle: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 24,
        lineHeight: 29,
        color: globals.primaryColor,
        marginLeft: 9,
    },
    headerSubTitle: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 20,
        color: globals.primaryColor,
        marginRight: 7,
    },
    headerTopContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    headerSubContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    headerPriceText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
        color: globals.primaryColor,
        marginLeft: 6,
    },
    productCardContainer: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: globals.cardBackgroundColor,

        shadowColor: globals.shadowColor,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    productCardName: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
        color: globals.mainTextColor,
        paddingTop: 5,
    },
    productCardComposition: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontSize: 10,
        lineHeight: 13,
        color: globals.additionalTextColor,
    },
    productCardPrice: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 10,
        lineHeight: 13,
        color: globals.primaryColor,
        paddingTop: 13,
    },
    productCardCrossedOutPrice: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 10,
        lineHeight: 13,
        color: globals.crossedOutPriceColor,
        textDecorationLine: 'line-through',
    },
    productCardShoppingCartButton:{
        borderRadius: 50,
        backgroundColor: globals.shadowColor,
        width: 30,
        height: 30,
        opacity: 0.2
    },
    productCardShoppingCartButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    mainScreenProductCardContainer:{
        paddingVertical: 15,
        paddingHorizontal: 27,
    },
    mainScreenContainer: {
        width: "100%",
    },
    mainScreenPaddings:{
        paddingHorizontal: 27,
        paddingVertical: 17,
    },
    backgroundOverlay: {
        backgroundColor: globals.backgroundOverlay,
        flex: 1,
        opacity: 0.95,
    },
    headerCategoryButton: {
        flexDirection: "row",
        marginLeft: 40,
        marginTop: 10,
    },
    headerCategoryUnderline: {
        backgroundColor: globals.headerUnderlineColor,
        width: "auto",
        height: 2,
        marginLeft: 38,
        marginTop: 3
    },
    categoriesScreenContainer: {
        backgroundColor: "rgba(255,255,255,0.95)",
        flex: 1,
    },
    categoriesScreenColumnMargin: {
        margin: 10
    },
    categoriesScreenContainerPadding: {
        padding: 26,
    },
    categoriesScreenHeaderContainer: {
        paddingVertical: 24,
        paddingHorizontal: 26,
    },
    categoriesScreenHeader: {
        flexDirection: "row",
        justifyContent: "center",
    },
    categoriesScreenHeaderText: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 16,
        lineHeight: 20,
        color: globals.primaryColor,
    },
    headerFishBackButton: {
        position: "absolute",
        left: 0,
    },
    categoriesScreenCard:{
        borderRadius: 10,
    },
    categoriesScreenCardTitleContainer: {
        position: "absolute",
        width: "100%",
        backgroundColor: "rgba(0,0,0,0.35)",
        alignItems: "center",
        paddingVertical: 6,
        top: "60%",
    },
    categoriesScreenCardTitle: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
        color: "#FFFFFF"
    },
    mainScreenCategory: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
        backgroundColor: globals.cardBackgroundColor,
    },
    mainScreenCategoryText: {
        fontFamily: "Montserrat",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 17,
    },
    mainScreenCategoryHeight: {
        height: 30,
    }
  }
);

export {stylesheet, globals};
