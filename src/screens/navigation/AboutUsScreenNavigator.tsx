import * as React from "react";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import AboutUsScreen from "../AboutUsScreen";

export default function AboutUsScreenNavigator(props: any) {
    return (
        <MainBackground>
            <Header headerText={"Море рыбы"} subheaderText={"О нас"} drawerNavigation={props.navigation} />
            <AboutUsScreen />
        </MainBackground>
    );
}
