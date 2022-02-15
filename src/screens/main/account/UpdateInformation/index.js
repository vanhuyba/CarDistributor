import React, { Component } from "react";
import Container from "../../../../components/Container";
import AppTextInput from "../../../../components/AppTextInput";
import Strings from "../../../../utils/LocalizationHelper";
import styles from "./styles";
import Colors from "../../../../assets/Colors";
import {
    AsyncStorage,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text, TextInput,
    TouchableOpacity, View
} from "react-native";
import AppButton from "../../../../components/AppButton";
import AppOverlay from "../../../../components/AppOverlay";
import { connect } from "react-redux";
import * as AccountAction from "../AccountAction";
import Toast from "react-native-simple-toast";

class UpdateInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        this._initialState();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: Strings("header.update_information")
        };
    };

    componentWillReceiveProps(nextProps, nextContext) {
        console.log("NextProps", nextProps);
        let { accountReducer } = nextProps;
        switch (accountReducer.action) {
            case AccountAction.REQUEST_UPDATE_INFORMATION.SUCCESS:
                Toast.show(Strings("message.update_info_success"), Toast.SHORT);
                this.props.navigation.goBack();
                break;
            case AccountAction.REQUEST_UPDATE_INFORMATION.ERROR:
                Toast.show(Strings("message.error"), Toast.SHORT);
                break;
            default:
                return;
        }
    }

    _initialState = async () => {
        try {
            let { name, phoneNumber } = this.props.accountReducer.userInfo;
            console.log("Name", name);
            if (!name)
                name = "";

            console.log("PhoneNumber", phoneNumber);
            if (!phoneNumber)
                phoneNumber = "";

            this.setState({ name, phoneNumber });
        } catch (e) {
            console.log(e);
        }
    };

    _changePassword() {
        console.log("Props: ", this.props);
        this.props.navigation.navigate("ChangePassword");
    }

    _updateInformation() {
        let params = {
            role: "suppliers",
            name: this.state.name,
            phoneNumber: this.state.phoneNumber
        };

        this.props.dispatch(AccountAction.requestUpdateInformation(params));

    }

    render() {
        let { isLoading } = this.props.accountReducer.updateInformation;

        return (
            <Container>
                <ScrollView
                    scrollEnabled
                    keyboardShouldPersistTaps='handled'>
                    <KeyboardAvoidingView
                        behavior="padding"
                    >
                        <AppTextInput
                            inputStyle={{ borderBottomColor: Colors.colorLightGrey }}
                            labelStyle={styles.descriptionStyle}
                            floatLabel={true}
                            placeholder={Strings('label.name')}
                            containerStyle={{ backgroundColor: Colors.colorWhite }}
                            value={this.state.name}
                            onChangeText={text => {
                                this.setState({
                                    name: text
                                });
                            }}
                        />

                        <AppTextInput
                            labelStyle={styles.descriptionStyle}
                            floatLabel={true}
                            keyboardType={'phone-pad'}
                            placeholder={Strings('label.phone_number')}
                            containerStyle={{ backgroundColor: Colors.colorWhite, marginTop: 20 }}
                            value={this.state.phoneNumber}
                            onChangeText={text => {
                                this.setState({
                                    phoneNumber: text
                                });
                            }}
                            input={{ keyboardType: "phone-pad" }}
                        />

                        <Text style={styles.labelStyle}>
                            {Strings("label.password")}
                        </Text>
                        <TouchableOpacity onPress={() => { this._changePassword() }}>
                            <Text style={styles.changePassword}>
                                {Strings("label.change_password")}
                            </Text>
                        </TouchableOpacity>

                        <AppButton
                            block
                            rounded
                            style={styles.btnSave}
                            onPress={() => this._updateInformation()}
                        >
                            <Text style={styles.saveLabel}>
                                {Strings("label.save")}
                            </Text>
                        </AppButton>
                        <View style={{ height: 60 }} />

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

function mapStateToProps(state) {
    return {
        accountReducer: state.accountReducer
    };
}

UpdateInformation = connect(mapStateToProps)(UpdateInformation);
export default UpdateInformation;
