import React, {Component} from "react";
import Container from "../../../../components/Container";
import Colors from "../../../../assets/Colors";
import Strings from "../../../../utils/LocalizationHelper";
import AppTextInput from "../../../../components/AppTextInput";
import styles from "./styles"
import {KeyboardAvoidingView, ScrollView, Text} from "react-native";
import AppButton from "../../../../components/AppButton";
import Toast from "react-native-simple-toast";
import {REQUEST_CHANGE_PASSWORD} from "../AccountAction";
import AppOverlay from "../../../../components/AppOverlay";
import {ApiHelper} from "../../../../data/remote/ApiHelper";
import Constants from "../../../../data/Constants";
import AsyncStorage from '@react-native-community/async-storage';
import StoreConstant from "../../../../data/StoreConstant";
import {Input} from "native-base";

class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
            currentPasswordShown: false,
            newPasswordShown: false,
            confirmPasswordShown: false,
            currentPasswordError: false,
            newPasswordError: false,
            confirmPasswordError: false,
            currentPasswordErrorText: "",
            newPasswordErrorText: "",
            confirmPasswordErrorText: ""
        };
    }

    componentWillReceiveProps(nextProps, nextState) {
        let {accountReducer} = nextProps;

        switch (accountReducer.action) {
            case REQUEST_CHANGE_PASSWORD.SUCCESS:
                Toast.show(Strings("message.success"), Toast.SHORT);
                this.props.navigation.goBack();
                break;
            case REQUEST_CHANGE_PASSWORD.ERROR:
                Toast.show(Strings("message.error"), Toast.SHORT);
                break;
        }
    };

    static navigationOptions = ({navigation}) => {
        return {
            title: Strings("header.change_password")
        };
    };

    _changePassword = (currentPassword, newPassword) => {
        this.setState({
            currentPasswordError: false,
            newPasswordError: false,
            confirmPasswordError: false,
            currentPasswordErrorText: "",
            newPasswordErrorText: "",
            confirmPasswordErrorText: ""
        }, () => {
            let data = {
                old_password: currentPassword,
                new_password: newPassword
            };
            this.setState({isLoading: true}, () => {
                ApiHelper.post(Constants.API_PATH_CHANGE_PASSWORD, data).then(response => {
                    console.log("ChangePassword::response", response);
                    if (response && response.token_id) {
                        let token = response.token_id;
                        console.log(token);

                        if (token) {
                            AsyncStorage.setItem(StoreConstant.TOKEN, token).then(() => {
                                Toast.show(Strings("message.success"), Toast.SHORT);
                                this.props.navigation.goBack();
                            });
                        }
                    }
                }).catch(function (err) {
                    console.log("ChangePassword::response", err);
                    Toast.show(Strings("message.error"), Toast.SHORT);
                }).then(() => {
                    this.setState({isLoading: false});
                });
            });

        });
    };

    _validateForm() {
        let {currentPassword, newPassword, confirmPassword} = this.state;

        if (!currentPassword) {
            this.setState({
                currentPasswordError: true,
                currentPasswordErrorText: Strings("message.not_null")
            });
            return;
        } else {
            this.setState({
                currentPasswordError: false,
            })
        }

        if (!newPassword) {
            this.setState({
                newPasswordError: true,
                newPasswordErrorText: Strings("message.not_null")
            });
            return;
        } else {
            this.setState({
                newPasswordError: false
            })
        }

        if (!confirmPassword) {
            this.setState({
                confirmPasswordError: true,
                confirmPasswordErrorText: Strings("message.not_null")
            });
            return;
        } else {
            this.setState({
                confirmPasswordError: false
            });
        }

        if (newPassword === confirmPassword) {
            this._changePassword(currentPassword, newPassword);
        } else {
            this.setState({
                confirmPasswordError: true,
                confirmPasswordText: Strings("message.password_do_not_match")
            });
        }
    };

    render() {
        let {isLoading} = this.state;

        return (
            <Container
                style={styles.container}
            >
                <ScrollView
                    scrollEnabled
                    keyboardShouldPersistTaps={"handled"}
                >
                    <KeyboardAvoidingView
                        behavior="padding"
                    >
                        <AppTextInput
                            secureTextEntry={!this.state.currentPasswordShown}
                            floatLabel={true}
                            labelStyle={styles.descriptionStyle}
                            placeholder={Strings('label.current_password')}
                            containerStyle={{backgroundColor: Colors.colorWhite}}
                            value={this.state.currentPassword}
                            onChangeText={text => {
                                this.setState({
                                    currentPassword: text
                                });
                            }}
                            showRightIcon={!!this.state.currentPassword}
                            rightIcon={this.state.currentPasswordShown ? "eye-off" : "eye"}
                            rightIconPress={() => {
                                this.setState({currentPasswordShown: !this.state.currentPasswordShown})
                            }}
                            showError={this.state.currentPasswordError}
                            errorText={this.state.currentPasswordErrorText}
                            input={{autoCapitalize: "none"}}

                        />

                        <AppTextInput
                            secureTextEntry={!this.state.newPasswordShown}
                            floatLabel={true}
                            labelStyle={styles.descriptionStyle}
                            placeholder={Strings("label.new_password")}
                            containerStyle={{backgroundColor: Colors.colorWhite, marginTop: 20}}
                            value={this.state.newPassword}
                            onChangeText={text => {
                                this.setState({
                                    newPassword: text
                                })
                            }}
                            showRightIcon={!!this.state.newPassword}
                            rightIcon={this.state.newPasswordShown ? "eye-off" : "eye"}
                            rightIconPress={() => {
                                this.setState({newPasswordShown: !this.state.newPasswordShown})
                            }}
                            showError={this.state.newPasswordError}
                            errorText={this.state.newPasswordErrorText}
                            input={{autoCapitalize: "none"}}
                        />

                        <AppTextInput
                            secureTextEntry={!this.state.confirmPasswordShown}
                            floatLabel={true}
                            labelStyle={styles.descriptionStyle}
                            placeholder={Strings("label.confirm_password")}
                            containerStyle={{backgroundColor: Colors.colorWhite, marginTop: 20}}
                            value={this.state.confirmPassword}
                            onChangeText={text => {
                                this.setState({
                                    confirmPassword: text
                                })
                            }}
                            showRightIcon={!!this.state.confirmPassword}
                            rightIcon={this.state.confirmPasswordShown ? "eye-off" : "eye"}
                            rightIconPress={() => {
                                this.setState({confirmPasswordShown: !this.state.confirmPasswordShown})
                            }}
                            showError={this.state.confirmPasswordError}
                            errorText={this.state.confirmPasswordErrorText}
                            input={{autoCapitalize: "none"}}
                        />

                        <AppButton
                            block
                            rounded
                            style={[styles.btnChangePassword]}
                            onPress={() => this._validateForm()}
                        >
                            <Text style={{color: Colors.colorWhite, fontWeight: "bold"}}>
                                {Strings('label.save')}
                            </Text>
                        </AppButton>
                    </KeyboardAvoidingView>
                </ScrollView>
                <AppOverlay
                    text={'Loading'}
                    isVisible={isLoading}
                />
            </Container>
        )
    }
}

export default ChangePassword;
