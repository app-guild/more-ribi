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
});

export {stylesheet, globals};
