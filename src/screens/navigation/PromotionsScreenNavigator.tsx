import * as React from "react";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import PromotionsScreen from "../PromotionsScreen";

export default function PromotionsScreenNavigator(props: any) {
    return (
        <MainBackground>
            <Header headerText={"Много рыбы"} subheaderText={"Новости"} drawerNavigation={props.navigation} />
            <PromotionsScreen />
        </MainBackground>
    );
}
