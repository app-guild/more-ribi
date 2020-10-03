import React, {Component} from "react";
import {FlatList, StyleSheet} from "react-native";
import InstagramPost from "../entities/InstagramPost";
import RealtimeDatabaseApi from "../api/firebase/RealtimeDatabaseApi";
import PromotionCard from "../components/PromotionCard";
import {Divider} from "react-native-paper";
import {globalColors} from "../../resources/styles";

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

    private _renderItem = ({item}: {item: InstagramPost}) => {
        return <PromotionCard text={item.text} imageUrl={item.imageUrl} linkToPromotion={item.link} />;
    };

    private _renderSeparator = () => {
        return <Divider style={stylesheet.divider} />;
    };

    render() {
        return (
            <>
                <FlatList
                    contentContainerStyle={stylesheet.container}
                    data={this.state.promotions}
                    initialNumToRender={10}
                    maxToRenderPerBatch={5}
                    renderItem={this._renderItem}
                    ItemSeparatorComponent={this._renderSeparator}
                    keyExtractor={(item, index) => String(index)}
                    ListHeaderComponent={() => <Divider style={stylesheet.firstDivider} />}
                />
            </>
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
        backgroundColor: globalColors.additionalTextColor,
    },
    firstDivider: {
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: globalColors.additionalTextColor,
    },
});
