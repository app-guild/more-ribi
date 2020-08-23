import 'react-native-gesture-handler';
import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import MainScreen from "../screens/MainScreen";
import MyOrdersScreen from "../screens/MyOrdersScreen";
import RestaurantsScreen from "../screens/RestaurantsScreen";
import PromotionsScreen from "../screens/PromotionsScreen";
import DeliveryConditionsScreen from "../screens/DeliveryConditionsScreen";
import FeedbackScreen from "../screens/FeedbackScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import {Dimensions} from "react-native";

const Drawer = createDrawerNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Меню доставки"
        edgeWidth={Dimensions.get("window").width/3}
      >
        <Drawer.Screen name="Меню доставки" component={MainScreen} />
        <Drawer.Screen name="Мои заказы" component={MyOrdersScreen} />
        <Drawer.Screen name="Рестораны" component={RestaurantsScreen} />
        <Drawer.Screen name="Акции" component={PromotionsScreen} />
        <Drawer.Screen name="Условия доставки" component={DeliveryConditionsScreen} />
        <Drawer.Screen name="Обратная связь" component={FeedbackScreen} />
        <Drawer.Screen name="О приложении" component={AboutUsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
