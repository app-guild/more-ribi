import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import AboutUsScreen from "../AboutUsScreen";

const Stack = createStackNavigator();

export default function AboutUsScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation}) => (
                        <Header
                            headerText={"Море рыбы"}
                            subheaderText={"О нас"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                headerMode={"screen"}>
                <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
