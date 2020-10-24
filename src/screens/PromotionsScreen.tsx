import React, {Component} from "react";
import {FlatList, StyleSheet, Text, View} from "react-native";
import InstagramPost from "../entities/InstagramPost";
import PromotionCard from "../components/PromotionCard";
import {Divider} from "react-native-paper";
import {globalColors} from "../../resources/styles";
import PageNewsLoader from "../api/firebase/PageNewsLoader";

export interface IPromotionsScreenState {
    promotions: InstagramPost[];
    isLoaded: boolean;
    showMoreVisible: boolean;
}

const PAGESIZE = 5;

export default class PromotionsScreen extends Component<Readonly<any>, Readonly<IPromotionsScreenState>> {
    private pageNewsLoader: PageNewsLoader = new PageNewsLoader(PAGESIZE);
    private flatListRef: FlatList<InstagramPost> | null = null;

    constructor(props: any) {
        super(props);
        this.state = {
            promotions: [],
            isLoaded: false,
            showMoreVisible: false,
        };
        this.getMorePosts = this.getMorePosts.bind(this);
    }

    componentDidMount() {
        return this.pageNewsLoader.getNextPage().then((posts) => {
            this.setState({promotions: posts, isLoaded: true, showMoreVisible: !this.pageNewsLoader.pagesOut});
        });
    }

    private _renderItem = ({item}: {item: InstagramPost}) => {
        return <PromotionCard text={item.text} imageUrl={item.imageUrl} linkToPromotion={item.link} />;
    };

    private _renderSeparator = () => {
        return <Divider style={stylesheet.divider} />;
    };

    private getMorePosts() {
        return this.pageNewsLoader.getNextPage().then((posts) => {
            if (posts.length) {
                const endIndex = this.state.promotions.length;
                let wait = new Promise((resolve) => setTimeout(resolve, 300));
                wait.then(() => {
                    this.flatListRef?.scrollToIndex({index: endIndex, animated: true, viewOffset: 25});
                });
                this.setState({
                    promotions: this.state.promotions.concat(posts),
                    showMoreVisible: !this.pageNewsLoader.pagesOut,
                });
            }
        });
    }

    render() {
        let unloadedCard;

        if (!this.state.isLoaded) {
            unloadedCard = (
                <View>
                    <View style={stylesheet.unloadedImage} />
                    <View style={stylesheet.unloadedHeader} />
                    <View style={stylesheet.unloadedText} />
                </View>
            );
        }

        return (
            <>
                {this.state.isLoaded ? (
                    <FlatList
                        ref={(ref) => {
                            this.flatListRef = ref;
                        }}
                        onScrollToIndexFailed={() => {}}
                        contentContainerStyle={stylesheet.container}
                        data={this.state.promotions}
                        initialNumToRender={10}
                        maxToRenderPerBatch={5}
                        renderItem={this._renderItem}
                        ItemSeparatorComponent={this._renderSeparator}
                        keyExtractor={(item, index) => String(index)}
                        ListHeaderComponent={() => <Divider style={stylesheet.firstDivider} />}
                        ListFooterComponent={() =>
                            this.state.showMoreVisible ? (
                                <View style={stylesheet.showMoreButton} onTouchEnd={this.getMorePosts}>
                                    <Text>Показать ещё</Text>
                                </View>
                            ) : null
                        }
                    />
                ) : (
                    <View style={stylesheet.container}>
                        <Divider style={stylesheet.firstDivider} />
                        {unloadedCard}
                        <Divider style={stylesheet.divider} />
                        {unloadedCard}
                        <Divider style={stylesheet.divider} />
                        {unloadedCard}
                    </View>
                )}
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
    unloadedImage: {
        backgroundColor: globalColors.unloadedCard,
        height: 220,
    },
    unloadedHeader: {
        marginTop: 10,
        height: 30,
        width: "40%",
        backgroundColor: globalColors.unloadedCard,
        borderRadius: 10,
    },
    unloadedText: {
        marginTop: 10,
        height: 20,
        backgroundColor: globalColors.unloadedCard,
        borderRadius: 10,
    },
    showMoreButton: {
        marginTop: 15,
        padding: 5,
        borderColor: globalColors.primaryColor,
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
    },
});
