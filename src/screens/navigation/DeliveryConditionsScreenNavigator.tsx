import * as React from "react";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import DeliveryConditionsScreen from "../DeliveryConditionsScreen";

export default function DeliveryConditionsScreenNavigator(props: any) {
    return (
        <MainBackground>
            <Header headerText={"Много рыбы"} drawerNavigation={props.navigation} subheaderText={"Условия доставки"} />
            <DeliveryConditionsScreen />
        </MainBackground>
    );
}
