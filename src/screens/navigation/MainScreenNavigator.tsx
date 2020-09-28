import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainScreen from "../MainScreen";
import CategoriesScreen from "../CategoriesScreen";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import CartScreen from "../CartScreen";

const Stack = createStackNavigator();

export default function MainScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({scene, navigation}) => (
                        <Header
                            isCartScreen={scene.route.name === "CartScreen"}
                            screenTitle={"Море рыбы"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                        />
                    ),
                    cardOverlay: () => <MainBackground />,
                    headerStyle: {backgroundColor: globalColors.fadePrimaryColor},
                    cardStyle: {backgroundColor: globalColors.transparent},
                }}
                initialRouteName="Main"
                headerMode={"screen"}>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Categories" component={CategoriesScreen} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
