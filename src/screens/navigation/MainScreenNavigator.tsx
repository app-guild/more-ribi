import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainScreen from "../MainScreen";
import CategoriesScreen from "../CategoriesScreen";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import CartScreen from "../CartScreen";
import CreateOrderScreen from "../CreateOrderScreen";

const Stack = createStackNavigator();

export default function MainScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation, scene}) => (
                        <Header
                            headerText={"Море рыбы"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                            showBackButton={scene.descriptor.options.showBackButton}
                            subheaderText={scene.descriptor.options.subheaderText as string}
                            sceneName={scene.route.name}
                        />
                    ),
                    cardOverlay: () => <MainBackground />,
                    headerStyle: {backgroundColor: globalColors.fadePrimaryColor},
                    cardStyle: {backgroundColor: globalColors.transparent},
                }}
                initialRouteName="Main"
                headerMode={"screen"}>
                <Stack.Screen name="Main" options={{showBackButton: false}} component={MainScreen} />
                <Stack.Screen name="Categories" options={{subheaderText: "Разделы"}} component={CategoriesScreen} />
                <Stack.Screen name="CartScreen" options={{subheaderText: "Ваш улов:"}} component={CartScreen} />
                <Stack.Screen
                    name="CreateOrderScreen"
                    options={{subheaderText: "Оформляем заказ"}}
                    component={CreateOrderScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
