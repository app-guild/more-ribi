import {StyleSheet} from "react-native";

const globals = {
    primaryColor: "#779DB9",
    accentColor: "#E5E5E5",
    mainBackgroundColor: "#E5E5E5",
    navigatorBackgroundColor: "white",
    mainTextColor: "#000000",
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
        fontWeight: "900",
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
    dishCardContainer: {
        borderRadius: 20,
        padding: 10,
        backgroundColor: "#FFFFFF",

        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.41,
        elevation: 2,
    },
    dishCardName: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: 14,
        lineHeight: 18,
        color: globals.mainTextColor,
        paddingTop: 5,
    },
    dishCardComposition: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: 10,
        lineHeight: 13,
        color: "#CFD2D7",
    },
    dishCardPrice: {
        fontFamily: "Muli",
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: 10,
        lineHeight: 13,
        color: globals.primaryColor,
        //textAlign: "right",
        paddingTop: 13,
    },
    dishCardShoppingCartButton:{
        borderRadius: 50,
        backgroundColor: "#000000",
        width: 30,
        height: 30,
        opacity: 0.2
    },
    dishCardShoppingCartButtonContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    mainScreenContainer: {
        width: "100%",
    },
});

export {stylesheet, globals};
