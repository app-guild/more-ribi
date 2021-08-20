import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import CartScreen from "../CartScreen";
import CreateOrderScreen from "../CreateOrderScreen";

const Stack = createStackNavigator();

export default function CartScreenNavigation(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation, scene}) => (
                        <Header
                            headerText={"Много рыбы"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                            showBackButton={scene.descriptor.options.showBackButton}
                            subheaderText={scene.descriptor.options.subheaderText as string}
                            sceneName={scene.route.name}
                        />
                    ),
                    cardOverlayEnabled: true,
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="Main"
                headerMode={"screen"}>
                <Stack.Screen name={"CartScreen"} options={{subheaderText: "Ваш улов:"}} component={CartScreen} />
                <Stack.Screen
                    name="CreateOrderScreen"
                    initialParams={{drawerNavigation: props.navigation}}
                    options={{subheaderText: "Оформляем заказ", showBackButton: true}}
                    component={CreateOrderScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
