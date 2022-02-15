import React from 'react';
import {StyleSheet} from 'react-native';
import {Button} from 'native-base';
import BaseButton from "../BaseView/BaseButton";
import Colors from "../../assets/Colors";

class AppButton extends BaseButton {
    constructor(props) {
        super(props);
        this.state = {
            userAction: false
        };
    }

    render() {
        let touchable;
        const {center} = this.props;
        const _style = this._computeStyle({alignSelf: center ? 'center' : null}, styles.button, this.props.style);
        touchable = (
            <Button
                {...this.props}
                style={_style}
                activeOpacity={0.5}
                onPress={() => {
                    this.onPress();
                }}
            />
        );

        return touchable;
    }
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        backgroundColor: Colors.colorPrimary
    }
});

export default AppButton;
