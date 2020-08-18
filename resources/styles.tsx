import {StyleSheet} from "react-native";

const globals = {
    mainBackgroundColor: "#F2F3F7",
    mainTextColor: "#97A3B8",
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
        fontSize: 18,
        fontFamily: "Montserrat-Regular",
        color: globals.mainTextColor,
    },
});

export {stylesheet, globals};
