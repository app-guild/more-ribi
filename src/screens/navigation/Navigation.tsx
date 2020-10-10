import * as React from "react";
import {Dimensions} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {createDrawerNavigator} from "@react-navigation/drawer";
import RestaurantsScreen from "../RestaurantsScreen";
import AboutUsScreen from "../AboutUsScreen";
import MainScreenNavigator from "./MainScreenNavigator";
import {globalColors} from "../../../resources/styles";
import FeedbackScreenNavigator from "./FeedbackScreenNavigator";
import PromotionsScreenNavigator from "./PromotionsScreenNavigator";
import DeliveryConditionsScreenNavigator from "./DeliveryConditionsScreenNavigator";
import MyOrdersScreenNavigator from "./MyOrdersScreenNavigator";
import AboutUsScreenNavigator from "./AboutUsScreenNavigator";

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
                <Drawer.Screen name="Мои заказы" component={MyOrdersScreenNavigator} />
                <Drawer.Screen name="Рестораны" component={RestaurantsScreen} />
                <Drawer.Screen name="Новости" component={PromotionsScreenNavigator} />
                <Drawer.Screen name="Условия доставки" component={DeliveryConditionsScreenNavigator} />
                <Drawer.Screen name="Обратная связь" component={FeedbackScreenNavigator} />
                <Drawer.Screen name="О приложении" component={AboutUsScreenNavigator} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
