import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import MainScreen from "./screens/MainScreen";
import AboutUsScreen from "./screens/AboutUsScreen";
import CartScreen from "./screens/CartScreen";
// @ts-ignore
import SoupIcon from "./../resources/assets/drawable/soup_icon.svg";
// @ts-ignore
import FishIcon from "./../resources/assets/drawable/fish_icon.svg";
// @ts-ignore
import CartIcon from "./../resources/assets/drawable/cart_icon.svg";
import {globals, stylesheet} from "../resources/styles";

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName={"Menu"}
                backBehavior={"history"}
                tabBarOptions={{
                    keyboardHidesTabBar: true,
                    labelPosition: "below-icon",
                    inactiveTintColor: globals.accentColor,
                    activeTintColor: globals.primaryColor,
                    style: stylesheet.bottomNavigator,
                }}>
                <Tab.Screen
                    name="Menu"
                    component={MainScreen}
                    options={{
                        tabBarLabel: "Меню",
                        tabBarIcon: ({focused, color, size}) => (
                            <SoupIcon width={size} height={size} fill={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="AboutUs"
                    component={AboutUsScreen}
                    options={{
                        tabBarLabel: "О нас",
                        tabBarIcon: ({focused, color, size}) => (
                            <FishIcon width={size} height={size} fill={color} />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{
                        tabBarLabel: "Корзина",
                        tabBarIcon: ({focused, color, size}) => (
                            <CartIcon width={size} height={size} fill={color} />
                        ),
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}
