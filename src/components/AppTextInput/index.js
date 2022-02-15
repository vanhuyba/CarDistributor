import BaseInput from "../BaseView/BaseInput";
import React from "react";
import {Text, View} from "react-native";
import {Icon, Input, Item} from "native-base";
import renderIf from "../../utils/RenderHelper";
import styles from "./styles";

export default class AppTextInput extends BaseInput {
    render() {
        let {
            icon,
            input,
            containerStyle,
            inputStyle,
            floatLabel,
            labelStyle,
            showLeftIcon,
            leftIconStyle,
            showRightIcon,
            rightIconStyle,
            rightIcon,
            rightIconPress,
            errorText,
            showError,
            textErrorStyle,
            placeholder,
            secureTextEntry,
            onSubmitEditing,
            returnKeyType,
            returnKeyLabel,
            onChangeText,
            value
        } = this.props;

        let {error, blur, isFocused} = this.state;
        let _labelStyle = this._computeStyle((!showError) ? styles.labelStyle : styles.labelStyleError, labelStyle);
        let _containerStyle = this._computeStyle((blur)
            ? styles.borderFocused
            : (showError)
                ? styles.borderNotFocusError
                : styles.borderNotFocus, styles.inputGrp, containerStyle);
        let _leftIconStyle = this._computeStyle(styles.icon, leftIconStyle);
        let _inputStyle = this._computeStyle(styles.input, inputStyle);
        let _textErrorStyle = this._computeStyle(styles.formErrorText1, textErrorStyle);
        let _rightIconStyle = this._computeStyle(styles.icon, rightIconStyle);

        let placeHolderText = (floatLabel) ? "" : placeholder;

        return (
            <View>
                <Item error={error && blur} style={_containerStyle}>
                    {renderIf(floatLabel === true,
                        <Text style={_labelStyle}>
                            {placeholder}
                        </Text>
                    )}

                    <View style={{flexDirection: "row"}}>
                        {renderIf(showLeftIcon === true, <Icon active name={icon} style={_leftIconStyle}/>)}
                        <Input
                            ref={c => {
                                this.textInput = c;
                            }}
                            placeholderTextColor="gray"
                            style={_inputStyle}
                            placeholder={placeHolderText}
                            secureTextEntry={secureTextEntry}
                            onSubmitEditing={onSubmitEditing}
                            returnKeyType={returnKeyType}
                            returnKeyLabel={returnKeyLabel}
                            onChangeText={
                                onChangeText
                            }
                            onBlur={() => {
                                this.validate(value);
                                this.setState({blur: false});
                            }}
                            onFocus={() => {
                                this.setState({blur: true});
                            }}
                            value={value}
                            {...input}
                        />
                        {renderIf(showRightIcon === true, <Icon active name={rightIcon} style={_rightIconStyle}
                                                                onPress={rightIconPress}/>)}
                    </View>
                </Item>
                <View style={styles.errorContainer}>
                    {renderIf(showError === true,
                        <Icon name={"alert"} style={_textErrorStyle}/>)
                    }
                    <Text style={[_textErrorStyle, {marginLeft: 5}]}>
                        {(showError) ? errorText : ""}
                    </Text>
                </View>
            </View>
        )
    }
}


AppTextInput.defaultProps = {
    errorText: "Error",
    floatLabel: false,
    inputStyle: {},
    leftIconStyle: {},
    containerStyle: {},
    textErrorStyle: {},
    labelStyle: {},
    showRightIcon: false,
    onSubmitEditing: () => {
    },
    returnKeyType: 'default',
    returnKeyLabel: '',
    onChangeText: () => {
    },
    validators: [],
    onValidationChanged: valid => {
    },
    showError: false
};
