import * as React from "react";
import Header from "../../components/Header";
import MainBackground from "../../components/MainBackground";
import FeedbackScreen from "../FeedbackScreen";

export default function MainScreenNavigator(props: any) {
    return (
        <MainBackground>
            <Header headerText={"Много рыбы"} subheaderText={"Отзыв"} drawerNavigation={props.navigation} />
            <FeedbackScreen />
        </MainBackground>
    );
}
