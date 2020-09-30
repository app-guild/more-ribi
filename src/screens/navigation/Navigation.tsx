import * as React from "react";
import {Dimensions} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import MyOrdersScreen from "../MyOrdersScreen";
import RestaurantsScreen from "../RestaurantsScreen";
import PromotionsScreen from "../PromotionsScreen";
import DeliveryConditionsScreen from "../DeliveryConditionsScreen";
import AboutUsScreen from "../AboutUsScreen";
import MainScreenNavigator from "./MainScreenNavigator";
import {globalColors} from "../../../resources/styles";
import FeedbackScreenNavigator from "./FeedbackScreenNavigator";

const Drawer = createDrawerNavigator();

export default function Navigation() {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                statusBarAnimation={"slide"}
                drawerContentOptions={{
                    activeTintColor: globalColors.headerUnderlineColor,
                    inactiveTintColor: globalColors.primaryColor,
                }}
                initialRouteName="Меню доставки"
                edgeWidth={Dimensions.get("window").width / 3}>
                <Drawer.Screen name="Меню доставки" component={MainScreenNavigator} />
                <Drawer.Screen name="Мои заказы" component={MyOrdersScreen} />
                <Drawer.Screen name="Рестораны" component={RestaurantsScreen} />
                <Drawer.Screen name="Акции" component={PromotionsScreen} />
                <Drawer.Screen name="Условия доставки" component={DeliveryConditionsScreen} />
                <Drawer.Screen name="Обратная связь" component={FeedbackScreenNavigator} />
                <Drawer.Screen name="О приложении" component={AboutUsScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
