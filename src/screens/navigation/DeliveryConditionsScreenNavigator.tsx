import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import DeliveryConditionsScreen from "../DeliveryConditionsScreen";

const Stack = createStackNavigator();

export default function DeliveryConditionsScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation, scene}) => (
                        <Header
                            headerText={"Море рыбы"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                            subheaderText={scene.descriptor.options.subheaderText as string}
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="Main"
                headerMode={"screen"}>
                <Stack.Screen
                    name="DeliveryConditions"
                    options={{subheaderText: "Условия доставки"}}
                    component={DeliveryConditionsScreen}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
