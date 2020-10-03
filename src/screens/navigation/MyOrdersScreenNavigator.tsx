import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import MyOrdersScreen from "../MyOrdersScreen";

const Stack = createStackNavigator();

export default function MyOrdersScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation}) => (
                        <Header
                            headerText={"Море рыбы"}
                            subheaderText={"Мои заказы"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="MyOrdersScreen"
                headerMode={"screen"}>
                <Stack.Screen name="MyOrdersScreen" component={MyOrdersScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
