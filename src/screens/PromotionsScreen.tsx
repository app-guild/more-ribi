import React, {Component} from "react";
import {ScrollView, StyleSheet} from "react-native";
import InstagramPost from "../entities/InstagramPost";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import PromotionCard from "../components/PromotionCard";
import {Divider} from "react-native-paper";

export interface IPromotionsScreenState {
    promotions: InstagramPost[];
}

export default class PromotionsScreen extends Component<Readonly<any>, Readonly<IPromotionsScreenState>> {
    constructor(props: any) {
        super(props);
        this.state = {
            promotions: [],
        };
    }

    componentDidMount() {
        return RealtimeDatabaseApi.getInstagramPosts().then((posts) => {
            this.setState({promotions: posts});
        });
    }

    render() {
        return (
            <ScrollView style={stylesheet.container}>
                {this.state.promotions.map((promotion, index) => {
                    const dividerStyle = {...stylesheet.divider};
                    if (index === 0) {
                        dividerStyle.marginTop = 5;
                    }
                    return (
                        <>
                            <Divider style={dividerStyle} />
                            <PromotionCard text={promotion.text} imageUrl={promotion.imageUrl} />
                        </>
                    );
                })}
                <Divider style={stylesheet.divider} />
            </ScrollView>
        );
    }
}

const stylesheet = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    divider: {
        marginTop: 20,
        marginBottom: 20,
    },
});
