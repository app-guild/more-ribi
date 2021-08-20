import React, {Component} from "react";
import {View} from "react-native-animatable";
import {globalColors} from "../../resources/styles";

export default class Divider extends Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    render(): any {
        return (
            <View
                style={Object.assign(
                    {
                        borderBottomColor: globalColors.additionalTextColor,
                        borderBottomWidth: 1,
                    },
                    this.props.style ? this.props.style : {},
                )}
            />
        );
    }
}
