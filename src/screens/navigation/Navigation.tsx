import * as React from "react";

import {Dimensions} from "react-native";
import {CommonActions, DrawerActions, NavigationContainer, useLinkBuilder} from "@react-navigation/native";
import {createDrawerNavigator, DrawerContentScrollView, DrawerItem} from "@react-navigation/drawer";
import RestaurantsScreen from "../RestaurantsScreen";
import MainScreenNavigator from "./MainScreenNavigator";
import {globalColors} from "../../../resources/styles";
import FeedbackScreenNavigator from "./FeedbackScreenNavigator";
import PromotionsScreenNavigator from "./PromotionsScreenNavigator";
import DeliveryConditionsScreenNavigator from "./DeliveryConditionsScreenNavigator";
import MyOrdersScreenNavigator from "./MyOrdersScreenNavigator";
import AboutUsScreenNavigator from "./AboutUsScreenNavigator";
import CartScreen from "../CartScreen";

const screens: {
    name: string,
    value: string,
    component: React.ComponentClass<any, any> | React.FunctionComponent<any>,
}[] = [
    {name: "Меню доставки", value: "MainScreen", component: MainScreenNavigator},
    {name: "Мои заказы", value: "MyOrders", component: MyOrdersScreenNavigator},
    {name: "Рестораны", value: "Restaurants", component: RestaurantsScreen},
    {name: "Новости", value: "Promotions", component: PromotionsScreenNavigator},
    {name: "Условия доставки", value: "DeliveryConditions", component: DeliveryConditionsScreenNavigator},
    {name: "Обратная связь", value: "Feedback", component: FeedbackScreenNavigator},
    {name: "О приложении", value: "AboutUs", component: AboutUsScreenNavigator},

    {name: "CartScreen", value: "CartScreen", component: CartScreen},
];

function DrawerContent(props: any) {
    const {
        state,
        descriptors,
        activeTintColor,
        inactiveTintColor,
        activeBackgroundColor,
        inactiveBackgroundColor,
        labelStyle,
        itemStyle,
        navigation,
    } = props;

    const buildLink = useLinkBuilder();
    const drawerItems = (state.routes.slice(0, -1).map((route: any, i: number) => {
        const focused = i === state.index;
        const {title, drawerLabel, drawerIcon} = descriptors[route.key].options;

        return (
            <DrawerItem
                key={route.key}
                label={drawerLabel !== undefined ? drawerLabel : title !== undefined ? title : route.name}
                icon={drawerIcon}
                focused={focused}
                activeTintColor={activeTintColor}
                inactiveTintColor={inactiveTintColor}
                activeBackgroundColor={activeBackgroundColor}
                inactiveBackgroundColor={inactiveBackgroundColor}
                labelStyle={labelStyle}
                style={itemStyle}
                to={buildLink(route.name, route.params)}
                onPress={() => {
                    navigation.dispatch({
                        ...(focused ? DrawerActions.closeDrawer() : CommonActions.navigate(route.name)),
                        target: state.key,
                    });
                }}
            />
        );
    }) as React.ReactNode) as React.ReactElement;

    return <DrawerContentScrollView {...props}>{drawerItems}</DrawerContentScrollView>;
}

const Drawer = createDrawerNavigator();

export default function Navigation() {
    const drawerScreens = screens.map((value, i) => (
        <Drawer.Screen key={i} name={value.name} component={value.component} />
    ));
    return (
        <NavigationContainer>
            <Drawer.Navigator
                statusBarAnimation={"slide"}
                drawerContentOptions={{
                    activeTintColor: globalColors.headerUnderlineColor,
                    inactiveTintColor: globalColors.primaryColor,
                }}
                drawerContent={(props) => <DrawerContent {...props} />}
                backBehavior={"history"}
                initialRouteName="Меню доставки"
                edgeWidth={Dimensions.get("window").width / 3}>
                {drawerScreens}
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
