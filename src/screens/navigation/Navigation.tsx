import * as React from "react";

import {Dimensions, View} from "react-native";
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
import CartScreenNavigation from "./CartNavigation";

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
    return (
        <NavigationContainer>
            <Drawer.Navigator
                statusBarAnimation={"slide"}
                drawerContentOptions={{
                    activeTintColor: globalColors.headerUnderlineColor,
                    inactiveTintColor: globalColors.primaryColor,
                }}
                drawerContent={(props) => <DrawerContent {...props} />}
                backBehavior={"initialRoute"}
                initialRouteName="Меню доставки"
                lazy={false}
                edgeWidth={Dimensions.get("window").width / 3}>
                <Drawer.Screen name={"Меню доставки"} component={MainScreenNavigator} />
                <Drawer.Screen name={"Мои заказы"} component={MyOrdersScreenNavigator} />
                <Drawer.Screen name={"Рестораны"} component={RestaurantsScreen} />
                <Drawer.Screen name={"Акции и новости"} component={PromotionsScreenNavigator} />
                <Drawer.Screen name={"Условия доставки"} component={DeliveryConditionsScreenNavigator} />
                <Drawer.Screen name={"Обратная связь"} component={FeedbackScreenNavigator} />
                <Drawer.Screen name={"О приложении"} component={AboutUsScreenNavigator} />
                <Drawer.Screen name={"CartScreen"} component={CartScreenNavigation} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}
