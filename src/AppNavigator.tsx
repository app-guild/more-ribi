import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import MainScreen from "./screens/MainScreen";
import PayScreen from "./screens/PayScreen";

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home" headerMode={"none"}>
                <Stack.Screen
                    name="Main"
                    component={MainScreen}
                    options={{animationEnabled: false}}
                />
                <Stack.Screen
                    name="Second"
                    component={PayScreen}
                    options={{animationEnabled: false}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
