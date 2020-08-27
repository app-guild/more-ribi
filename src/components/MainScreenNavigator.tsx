import 'react-native-gesture-handler';
import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainScreen from "../screens/MainScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import {createStackNavigator} from "@react-navigation/stack";
const Stack = createStackNavigator();

export default function MainScreenNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Main" headerMode={"none"}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
