import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import PromotionsScreen from "../PromotionsScreen";

const Stack = createStackNavigator();

export default function PromotionsScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation}) => (
                        <Header
                            headerText={"Море рыбы"}
                            subheaderText={"Новости и акции"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="PromotionsScreen"
                headerMode={"screen"}>
                <Stack.Screen name="PromotionsScreen" component={PromotionsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
