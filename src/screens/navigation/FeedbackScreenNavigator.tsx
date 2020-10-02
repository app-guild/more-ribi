import * as React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createStackNavigator} from "@react-navigation/stack";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import {globalColors} from "../../../resources/styles";
import FeedbackScreen from "../FeedbackScreen";

const Stack = createStackNavigator();

export default function MainScreenNavigator(props: any) {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    header: ({navigation}) => (
                        <Header
                            headerText={"Море рыбы"}
                            subheaderText={"Отзыв"}
                            stackNavigation={navigation}
                            drawerNavigation={props.navigation}
                        />
                    ),
                    headerStyle: {backgroundColor: globalColors.transparent},
                    cardStyle: {backgroundColor: globalColors.transparent},
                    cardOverlay: () => <MainBackground />,
                }}
                initialRouteName="FeedbackScreen"
                headerMode={"screen"}>
                <Stack.Screen name="FeedbackScreen" component={FeedbackScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
