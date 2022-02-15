import React, {Component} from "react";
import {Text, View} from "react-native";
import {Overlay} from "react-native-elements";
import Spinner from "react-native-spinkit";
import Colors from "../../assets/Colors";
import BaseView from "../BaseView/BaseView";
import styles from "./styles";
import AppTextInput from "../AppTextInput";

export default class AppOverlay extends BaseView{

    render() {
        let {
            loadingIcon,
            text,
            textStyle,
            isVisible,
            windowBackgroundColor,
            overlayBackgroundColor
        } = this.props;

        let _textStyle = this._computeStyle(styles.textStyle, textStyle);

        return (
            <Overlay
                isVisible={isVisible}
                windowBackgroundColor={windowBackgroundColor}
                overlayBackgroundColor={overlayBackgroundColor}
                width="auto"
                height="auto"
            >
                <View style={{padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Spinner isVisible={this.props.isLoading} type={loadingIcon} color={Colors.colorPrimary} size={30}/>
                    <Text style={_textStyle}>
                        {text}
                    </Text>
                </View>
            </Overlay>
        )
    }
}

AppOverlay.defaultProps = {
    loadingIcon: 'CircleFlip',
    windowBackgroundColor: Colors.colorGreyTransparent,
    overlayBackgroundColor: Colors.colorWhite
};
