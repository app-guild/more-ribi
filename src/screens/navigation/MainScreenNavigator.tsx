import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import MainScreen from "../MainScreen";
import CategoriesScreen from "../CategoriesScreen";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import PokeConstructorScreen from "../PokeConstructorScreen";

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
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="Main"
                headerMode={"screen"}>
                <Stack.Screen name="Main" component={MainScreen} />
                <Stack.Screen
                    name="Categories"
                    options={{subheaderText: "Разделы", showBackButton: true}}
                    component={CategoriesScreen}
                />
                <Stack.Screen name="PokeConstructor" component={PokeConstructorScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
