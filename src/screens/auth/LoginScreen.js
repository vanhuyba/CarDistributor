import React, { Component } from "react";
import {
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  LayoutAnimation,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  
} from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import Colors from "../../assets/Colors";
import AsyncStorage from '@react-native-community/async-storage';
import { ApiHelper } from "../../data/remote/ApiHelper";
import Spinner from "react-native-spinkit";
import renderIf from "../../utils/RenderHelper";
import Toast from "react-native-simple-toast";
import Strings from "../../utils/LocalizationHelper";
import StoreConstant from "../../data/StoreConstant";
import { normalize } from "../../utils/ViewUtils";
import Constants from "../../data/Constants";
import { firebase } from '@react-native-firebase/messaging';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPass: false,
      showRessetPass: false,
      isLoading: false,
      selectedType: null,
      fontLoaded: false,
      username: "",
      email: "",
      password: "",
      confirmationPassword: "",
      emailValid: true,
      passwordValid: true,
      usernameValid: true,
      confirmationPasswordValid: true
    };

    this.setSelectedType = this.setSelectedType.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePassword = this.validatePassword.bind(this);
    this.login = this.login.bind(this);
  }

  async login() {
    LayoutAnimation.easeInEaseOut();
    const { email, password } = this.state;
    const emailValid = this.validateEmail();
    const passwordValid = this.validatePassword();
    console.log("emailValid: " + email + "isValid: " + emailValid);
    console.log("passwordValid: " + password + "isValid: " + passwordValid);

    if (emailValid && passwordValid) {
      Keyboard.dismiss();
      this.setState({ isLoading: true });
      // const fcmToken = await firebase.messaging().getToken();
      var fcmToken = await AsyncStorage.getItem(StoreConstant.FIREBASE_TOKEN);
      if(!fcmToken) {
        fcmToken = await firebase.messaging().getToken(undefined, '*');
        console.log("fcmToken renew:" + fcmToken);
        AsyncStorage.setItem(StoreConstant.FIREBASE_TOKEN, fcmToken)
      }
      console.log("fcmToken " + fcmToken);
      ApiHelper.post(Constants.API_PATH_LOGIN, {
        email,
        password,
        firebaseToken: fcmToken
      }).then(response => {
        console.log("Login Success ------");
        console.log(response);
        // AsyncStorage.setItem(StoreConstant.ID, JSON.stringify(response.id));
        if (response.name) {
          AsyncStorage.setItem(StoreConstant.NAME, response.name);
        }
        if (response.email) {
          AsyncStorage.setItem(StoreConstant.EMAIL, response.email);
        }

        if (response.avatar) {
          AsyncStorage.setItem(StoreConstant.IMAGE_URL, response.avatar);
        }

        if (response.phoneNumber) {
          AsyncStorage.setItem(StoreConstant.PHONE_NUMBER, response.phoneNumber);
        }

        AsyncStorage.setItem(StoreConstant.TOKEN, response.token_id, () => {
          //Toast.show(Strings("message.login_success"), Toast.LONG);
          this.props.navigation.navigate("MainNav");
        });
      })
        .catch(function (error) {
          console.log("error login status------", error);
          console.log(JSON.stringify(error));
          Toast.show(error.message, Toast.LONG );
        })
        .then(() => {
          // always executed
          this.setState({ isLoading: false });
        });
    }
  }

  validateEmail() {
    const { email } = this.state;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(email);
    LayoutAnimation.easeInEaseOut();
    this.setState({ emailValid });
    emailValid || this.emailInput.shake();
    return emailValid;
  }

  validatePassword() {
    const { password } = this.state;
    const passwordValid = password.length > 0;
    LayoutAnimation.easeInEaseOut();
    this.setState({ passwordValid });
    passwordValid || this.passwordInput.shake();
    return passwordValid;
  }

  onChangeEmail = (e, name) => {
    this.setState({
      [name]: e.nativeEvent.text.toLowerCase()
    })
  }

  showHidePassword = () => {
    this.setState((prevState) => ({
      isShowPass: !prevState.isShowPass
    }))
  }

  requestResetPass = () => {
    const { emailResetPass } = this.state;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailValid = re.test(emailResetPass);
    if (!emailValid) {
      Toast.show(Strings("message.error_email"), Toast.LONG);
      return;
    }

    console.log("API_PATH_RESET_PASSWORD", emailResetPass);
    ApiHelper.post(Constants.API_PATH_RESET_PASSWORD, { email: this.state.emailResetPass }, {}).then(response => {
      console.log("API_PATH_RESET_PASSWORD", response);
      if (response) {
        this.setState({ showRessetPass: false });
        Toast.show(Strings("auth.reset_pass_success"), Toast.LONG);
      } else {
        Toast.show(Strings("auth.reset_pass_false"), Toast.LONG);
      }

    }).catch(error => {
      console.log("Upload image::Error", JSON.parse(JSON.stringify(error)));
    }).then(() => {
      Toast.show(Strings("auth.reset_pass_false"), Toast.LONG);
      this.setState({ showRessetPass: false });
    });
  }

  setSelectedType = selectedType =>
    LayoutAnimation.easeInEaseOut() || this.setState({ selectedType });

  render() {
    const {
      isShowPass,
      isLoading,
      email,
      emailValid,
      password,
      passwordValid
    } = this.state;

    console.log("LoginScreen Rerender")

    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={require("../../assets/icons/bg_login.png")}
          style={{ width: "100%", height: "100%" }}
          imageStyle={{ resizeMode: "cover" }}
        >
          <ScrollView
            scrollEnabled
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.container}
          >
            <KeyboardAvoidingView behavior="position">
              <View style={{ alignItems: "center", paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../../assets/icons/ic_app_login.png")}
                  style={{
                    marginBottom: 20,
                    width: normalize(98),
                    height: normalize(75)
                  }}
                />

                <Text
                  style={{
                    color: Colors.colorPrimary,
                    marginBottom: 40,
                    fontSize: normalize(13)
                  }}
                >
                  {Strings("auth.login_label")}
                </Text>

                <FormInput
                  refInput={input => (this.emailInput = input)}
                  icon="envelope"
                  value={email}
                  onChangeText={email => this.setState({ email })}
                  placeholder={Strings("auth.email")}
                  keyboardType="email-address"
                  returnKeyType="next"
                  errorMessage={
                    emailValid ? null : Strings("message.error_email")
                  }
                  onSubmitEditing={() => {
                    this.validateEmail();
                    this.passwordInput.focus();
                  }}
                />
                <FormInput
                  refInput={input => (this.passwordInput = input)}
                  icon="lock"
                  isRightIcon={true}
                  rightIcon={
                    < Icon name={isShowPass ? "eye-with-line": "eye"} type={"entypo"} color="#7384B4" backgroundColor="#ebebeb" size={20}
                      iconStyle={styles.rightIconStyle}
                      onPress={() => this.showHidePassword()}
                    />

                  }
                  value={password}
                  onChangeText={password => this.setState({ password })}
                  placeholder={Strings("auth.password")}
                  secureTextEntry={!isShowPass}
                  returnKeyType="next"
                  errorMessage={
                    passwordValid ? null : Strings("message.error_password")
                  }
                  onSubmitEditing={() => {
                    this.validatePassword();
                  }}
                />
                <Button
                  title={Strings("auth.login")}
                  buttonStyle={styles.signUpButton}
                  titleStyle={styles.signUpButtonText}
                  containerStyle={{ width: "110%" }}
                  onPress={this.login}
                  disabled={isLoading}
                />
              </View>
            </KeyboardAvoidingView>


          </ScrollView>
          <Button
            onPress={() => {
              this.setState({
                showRessetPass: true
              })
            }}
            title={Strings("auth.forgot_password")}
            buttonStyle={styles.forgotPass}
            titleStyle={{ fontSize: 15, fontStyle: "italic" }}
            containerStyle={{ flex: -1 }}
          />
        </ImageBackground>

        {renderIf(
          isLoading,
          <View
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(52, 52, 52, 0.8)",
              position: "absolute",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Spinner
              isVisible={this.state.isVisible}
              type={"Circle"}
              color={Colors.colorPrimary}
              size={60}
            />
          </View>
        )}

        {
          this.state.showRessetPass ? (
            <View style={styles.wrapDialog}>
              <View style={styles.dialog}>
                <Text style={styles.titleDialog}>
                  {Strings("auth.reset_pass")}
                </Text>
                <View style={styles.underTitleLine}></View>
                <View style={styles.dialogContent}>
                  <Text style={{ fontSize: 12 }}>{Strings("auth.enter_email")}</Text>
                  <TextInput autoFocus={true} onChange={(e) => this.onChangeEmail(e, "emailResetPass")} style={styles.input} placeholderTextColor="#d6d6d6" placeholder={Strings("auth.email")} value={this.state.emailResetPass} >
                  </TextInput>
                </View>

                <View style={styles.dialogFooter}>
                  <View style={styles.wrapBtn}>
                    <Button
                      onPress={() => this.requestResetPass()}
                      buttonStyle={styles.buttonConfirm}
                      titleStyle={styles.textBtnConfirm}
                      title={Strings("auth.reset_pass")}
                    >
                    </Button>
                  </View>

                  <View style={styles.wrapBtn}>
                    <Button
                      onPress={() => {
                        this.setState({
                          showRessetPass: false
                        })
                      }}
                      buttonStyle={styles.buttonCancel}
                      titleStyle={styles.textBtnCancle}
                      title={Strings("auth.cancel")}
                    >
                    </Button>
                  </View>

                </View>
              </View>
            </View>
          ) :
            null
        }



      </View>
    );
  }
}

export const FormInput = props => {
  const { icon, refInput, rightIcon, ...otherProps } = props;
  const [isFocus, setFocus] = React.useState(false);
  return (
    <Input
      {...otherProps}
      ref={refInput}
      inputContainerStyle={isFocus ? {...styles.inputContainer, borderColor: Colors.colorPrimary} : styles.inputContainer}
      leftIcon={
        <Icon name={icon} type={"simple-line-icon"} color="#7384B4" size={20} />
      }
      rightIcon={rightIcon}
      inputStyle={styles.inputStyle}
      autoFocus={false}
      autoCapitalize="none"
      keyboardAppearance="dark"
      errorStyle={styles.errorInputStyle}
      autoCorrect={false}
      blurOnSubmit={false}
      placeholderTextColor="#7384B4"
      onFocus={() =>setFocus(true)}
      onBlur={() =>setFocus(false)}
    />
  );
};

const styles = StyleSheet.create({
  wrapBtn: {
    width: "45%",
    marginHorizontal: 8,
  },
  rightIconStyle: {
    backgroundColor: '#ebebeb'
  },
  buttonCancel: {
    alignItems: "flex-start",
    backgroundColor: "transparent",
    borderWidth: 1,
    width: "100%",
    borderColor: "#FF7900",
    borderRadius: 30,
    paddingHorizontal: 16,
  },
  textBtnCancle: {
    fontSize: normalize(12),
    color: "#FF7900"
  },
  textBtnConfirm: {
    fontSize: normalize(12),
    color: "#FF7900"
  },
  buttonConfirm: {
    alignItems: "flex-start",
    width: "100%",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FF7900",
    borderRadius: 30,
    paddingHorizontal: 16,
  },
  dialogContent: {
    marginVertical: 16,
  },
  dialogFooter: {
    width: "100%",
    flexDirection: "row"
  },
  input: {
    color: "#000000",
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
    ...Platform.select({
      ios: {
      },
      android: {
        paddingBottom: 0
      }
    })

  },
  titleDialog: {
    color: "#FF7900",
    fontSize: normalize(14),
  },
  underTitleLine: {
    marginTop: normalize(4),
    height: 1,
    width: "100%",
    backgroundColor: "#d6d6d6"
  },
  dialog: {
    height: "auto",
    paddingVertical: 25,
    paddingHorizontal: 16,
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#FFFFFF"
  },
  wrapDialog: {
    paddingHorizontal: 16,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "#0000004D"
  },
  forgotPass: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    borderRadius: 50,
    alignItems: "center",
  },
  container: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
    justifyContent: "center"
  },
  signUpText: {
    color: "white",
    fontSize: 28
  },
  whoAreYouText: {
    color: "#7384B4",
    fontSize: 14
  },
  userTypesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: SCREEN_WIDTH,
    alignItems: "center"
  },
  userTypeItemContainer: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.5
  },
  userTypeItemContainerSelected: {
    opacity: 1
  },
  userTypeMugshot: {
    margin: 4,
    height: 70,
    width: 70
  },
  userTypeMugshotSelected: {
    height: 100,
    width: 100
  },
  userTypeLabel: {
    color: "yellow",
    fontSize: 11
  },
  inputContainer: {
    paddingRight: 8,
    paddingLeft: 4,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "#ebebeb",
    backgroundColor: "#ebebeb",
    height: "auto",
    marginBottom: 8
  },
  inputStyle: {
    flex: 1,
    padding: 0,
    marginLeft: 10,
    color: "#898989",
    fontSize: normalize(14)
  },
  errorInputStyle: {
    marginTop: 0,
    textAlign: "center",
    color: Colors.colorWhite
  },
  signUpButtonText: {
    fontSize: 15
  },
  signUpButton: {
    backgroundColor: Colors.colorPrimary,
    borderRadius: 50,
    marginHorizontal: 30,
    marginTop: 20,
    height: 45,
    alignContent: "center"
  },
  wrapForgot: {
    position: "absolute",
    bottom: 8,
    alignContent: "center",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  alreadyAccountText: {
    fontSize: 12,
    color: "white"
  },
  loginHereText: {
    color: "#FF9800",
    fontSize: 12
  }
});
