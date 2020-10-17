import React, {PureComponent} from "react";
import {Image, StyleSheet, View, Text, TouchableOpacity, Linking} from "react-native";
import {globalColors} from "../../resources/styles";
import ExpandableTextContainer from "react-native-expandable-text";

interface IPromotionCardProps {
    text: string;
    imageUrl?: string;
    linkToPromotion?: string;
    headerText?: string;
}

interface IPromotionCardState {
    collapsed: boolean;
}

export default class PromotionCard extends PureComponent<Readonly<IPromotionCardProps>, IPromotionCardState> {
    constructor(props: IPromotionCardProps) {
        super(props);

        this.state = {
            collapsed: true,
        };
    }

    private _onImagePress = () => {
        if (this.props.linkToPromotion && Linking.canOpenURL(this.props.linkToPromotion)) {
            Linking.openURL(this.props.linkToPromotion);
        }
    };

    // обязательный параметр в компоненте, но нам на него ничего не нужно делать
    private _onExpandableChange = () => {};

    private _toggleCollapsed = () => {
        this.setState({collapsed: !this.state.collapsed});
    };

    render() {
        const textStyle = {...stylesheet.text};
        if (!this.props.headerText) {
            textStyle.color = "#000000";
        }

        return (
            <View>
                {this.props.imageUrl ? (
                    <TouchableOpacity onPress={this._onImagePress}>
                        <Image source={{uri: this.props.imageUrl}} style={stylesheet.image} />
                    </TouchableOpacity>
                ) : null}
                {this.props.headerText ? (
                    <Text style={stylesheet.header} numberOfLines={1}>
                        {this.props.headerText}
                    </Text>
                ) : null}
                <ExpandableTextContainer
                    style={{marginTop: 10}}
                    collapsed={this.state.collapsed}
                    collapseNumberOfLines={4}
                    onExpandableChange={this._onExpandableChange}>
                    <Text style={textStyle} onPress={this._toggleCollapsed}>
                        {this.props.text}
                    </Text>
                </ExpandableTextContainer>
            </View>
        );
    }
}

const stylesheet = StyleSheet.create({
    image: {
        height: 220,
    },
    header: {
        fontFamily: "Mulish",
        fontSize: 16,
        marginTop: 10,
    },
    text: {
        fontFamily: "Mulish",
        fontSize: 12,
        color: globalColors.additionalTextColor,
    },
});
