import * as React from "react";
import Header from "../../components/Header";
import MyOrdersScreen from "../MyOrdersScreen";
import MainBackground from "../../components/MainBackground";

export default function MyOrdersScreenNavigator(props: any) {
    return (
        <MainBackground>
            <Header headerText={"Много рыбы"} subheaderText={"Мои заказы"} drawerNavigation={props.navigation} />
            <MyOrdersScreen />
        </MainBackground>
    );
}
