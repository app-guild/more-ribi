import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainScreen from "../MainScreen";
import CategoriesScreen from "../CategoriesScreen";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import CartScreen from "../CartScreen";
import PokeConstructorScreen from "../PokeConstructorScreen";

const Stack = createStackNavigator();

export default function MainScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation}) => (
                        <Header
                            screenTitle={"Море рыбы"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="Main"
                headerMode={"screen"}>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen name="Categories" component={CategoriesScreen} />
                <Stack.Screen name="CartScreen" component={CartScreen} />
                <Stack.Screen name="PokeConstructor" component={PokeConstructorScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
