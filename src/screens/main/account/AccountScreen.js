import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, RefreshControl, ScrollView } from "react-native";
import { Avatar } from "react-native-elements";
import Strings from "../../../utils/LocalizationHelper";
import AsyncStorage from '@react-native-community/async-storage';
import { normalize } from "../../../utils/ViewUtils";
import Colors from "../../../assets/Colors";
import StoreConstant from "../../../data/StoreConstant";
import * as Utils from "../../../utils/Utils.js";
import Toast from "react-native-simple-toast";
import Spinner from 'react-native-spinkit';
import Constants, { API_GET_IMAGE_URL, VERSION } from "../../../data/Constants";
import { ApiHelper } from "../../../data/remote/ApiHelper";
import AppOverlay from "../../../components/AppOverlay";
import { connect } from "react-redux";
import { saveUserInformation, clearUserInformation, fetchCurrentDebt, fetchHistoryDebt, fetchInfoProfile, requestLogout } from "./AccountAction";
import Ripple from 'react-native-material-ripple';
import { firebase } from '@react-native-firebase/messaging';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const currentTime = new Date();
const currentMonth = currentTime.getMonth() + 1;
const currentYear = currentTime.getFullYear();
export class AccountScreen extends Component {
    static navigationOptions = ({ navigation }) => ({
        title: Strings("header.profile"),
        headerRight: (
            <Ripple style={styles.headerRight}
                onPress={() => {
                    navigation.state.params.logOut();
                }}>
                <Image style={styles.iconSignout} source={require("icons/sign_out.png")} />
            </Ripple>
        )
    });

    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            isShowDeveloper: false,
            isRefresh: false,
            isLoading: false,
            isAvatarErr: false,
            ...this.props.accountReducer.userInfo
        };
    }

    componentDidMount() {
        this.props.onFetchCurrentDebt();
        this.props.onFetchProfile();
        this.props.onFetchHistoryDebt()
        this.props.navigation.setParams({ logOut: this.logOut });
        //this._loadInitialState().done();
    }

    onRefresh() {
        this.setState({
            isRefresh: true
        }, () => this.props.onFetchHistoryDebt())
        this.setState({
            isRefresh: false
        })

    }

    logOut = async () => {

        this.props.clearUserInformation();
        this.props.navigation.navigate("Login");
        await this.props.onLogout();
        AsyncStorage.multiRemove([StoreConstant.TOKEN, StoreConstant.NAME, StoreConstant.EMAIL, StoreConstant.IMAGE_URL, StoreConstant.PHONE_NUMBER]);

    };

    countVersionPressed = () => {
        this.setState((prevState) => ({
            count: prevState.count + 1
        }), () => {
            if (this.state.count == 10) this.setState({
                isShowDeveloper: true
            })
        })
    }

    _selectImage = async () => {
        let accessToken = await AsyncStorage.getItem(StoreConstant.TOKEN);

        Utils.selectPhoto(({ result, success, errorMsg }) => {
            console.log(result, errorMsg, success);
            if (success) {
                this.setState({ isLoading: true });
                console.log("Upload image::picker ", result);
                let data = new FormData();
                let image = {
                    uri: result.upload_uri,
                    name: result.fileName,
                    type: "image/jpg"
                };

                let config = {
                    headers: {
                        "access_token": accessToken,
                        "content_type": "application/x-www-form-urlencoded"
                    }
                };

                data.append("supplier", image);
                ApiHelper.post(Constants.API_PATH_UPDATE_IMAGE, data, config).then(response => {
                    console.log("Upload image::Response", response);
                    if (response) {
                        Toast.show(Strings("message.change_avatar_success"), Toast.LONG)
                        let data = {
                            avatar: response.avatar
                        };
                        AsyncStorage.setItem(StoreConstant.IMAGE_URL, response.avatar).then(() => {
                            this.props.saveUserInformation(data);
                        });
                    } else {
                        Toast.show(Strings("message.change_avatar_false"), Toast.LONG)
                    }

                }).catch(error => {
                    console.log("Upload image::Error", JSON.parse(JSON.stringify(error)));
                }).then(() => {
                    this.setState({ isLoading: false });
                });

            } else {
                //Toast.show(errorMsg, Toast.SHORT);
            }
        });
    };

    onAvatarError = () => {
        this.setState({
            isAvatarErr: true
        })
    }

    render() {


        if (this.props.isLoadingCurrentDebt || this.props.isLoadingHistoryDebt || this.props.isLoadingProfile)
            return <View style={styles.wrapSpiner}>
                <Spinner isVisible={true} type={'Circle'} color={Colors.colorPrimary} size={60} />
            </View>

        let { userInfo } = this.props;
        let imageUrl = userInfo.avatar;
        let source = { uri: API_GET_IMAGE_URL(imageUrl) }
        if (!imageUrl || this.state.isAvatarErr) {
            source = require('../../../assets/icons/default_avatar.png');
        }
        console.log("render img: " + imageUrl);
        return (
            <View style={styles.container}>
                <ScrollView style={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={this.state.isRefresh} onRefresh={() => this.onRefresh()} />
                    }
                >
                    <View
                        style={styles.main}
                    >
                        <View style={styles.userHeader}>
                            <Ripple
                                onPress={() => this._selectImage()}
                                style={styles.avatar}>
                                <Image
                                    style={styles.imgAvatar}
                                    source={source}
                                    onError={() => this.onAvatarError()}
                                />
                            </Ripple>

                            <Ripple
                                style={styles.openEditProfile}
                                onPress={() => {
                                    this.props.navigation.navigate("UpdateInformation")
                                }}
                            >
                                <View style={styles.userInfo}>
                                    <Text style={styles.name}>{userInfo.name}</Text>
                                    <Text style={styles.email}>{userInfo.email}</Text>
                                    <Text style={styles.phoneNumber}>{userInfo.phoneNumber}</Text>
                                </View>
                                <View>
                                    <Image
                                        style={styles.iconNavigate}
                                        source={require('../../../assets/icons/ic_navigate.png')}

                                    />
                                </View>
                            </Ripple>
                        </View>

                        <View style={styles.userBody}>
                            <Ripple style={styles.moneyKeeped}
                                onPress={() => {
                                    this.props.navigation.navigate('DetailDebtByMonth', { time: new Date() })
                                }}
                            >
                                <View>
                                    <Image
                                        style={styles.icon}
                                        source={require('../../../assets/icons/ic_wallet.png')}
                                    />
                                </View>
                                <View style={styles.moneyLabel}>
                                    <Text style={styles.label1}>{Strings("label.money_keeped")}</Text>
                                    <Text style={styles.label2}>{`Tháng ${currentMonth} năm ${currentYear}`}</Text>
                                </View>
                                <View>
                                    <Text style={styles.textMoneyBlue}>{Utils.formatVND(this.props.currentDebt.moneyKeeped)}</Text>
                                </View>
                                <View>
                                    <Image
                                        style={styles.iconNavigate}
                                        source={require('../../../assets/icons/ic_navigate.png')}
                                    />
                                </View>
                            </Ripple>

                            <Ripple style={styles.moneyKeeped}
                                onPress={() => {
                                    this.props.navigation.navigate('DetailDebtByMonth', { time: new Date() })
                                }}
                            >
                                <View>
                                    <Image
                                        style={styles.icon}
                                        source={require('../../../assets/icons/ic_money_receive.png')}
                                    />
                                </View>
                                <View style={styles.moneyLabel}>
                                    {/* âm: Hệ thống nợ F1
                                dương: F1 nợ hệ thống */}
                                    <Text style={styles.label1}>
                                        {
                                            this.props.currentDebt.sum > 0 ?
                                                Strings("label.sotienbannohethong") : Strings("label.sotienhethongnoban")
                                        }
                                    </Text>
                                    <Text style={styles.label2}>{`Tháng ${currentMonth} năm ${currentYear}`}</Text>
                                </View>
                                <View>
                                    <Text style={styles.textMoneyYellow}>{Utils.formatVND(Math.abs(this.props.currentDebt.sum))}</Text>
                                </View>
                                <View>
                                    <Image
                                        style={styles.iconNavigate}
                                        source={require('../../../assets/icons/ic_navigate.png')}
                                    />
                                </View>
                            </Ripple>
                            <Ripple style={styles.historyDebt}
                                onPress={() => {
                                    this.props.navigation.navigate("DebtHistory")
                                }}
                            >

                                <View>
                                    <Image
                                        style={styles.icon}
                                        source={require('../../../assets/icons/ic_history_debt.png')}
                                    />
                                </View>
                                <View style={styles.moneyLabel}>
                                    <Text style={styles.label1}>{Strings("label.history_debt")}</Text>
                                </View>
                                <View>
                                    {
                                        this.props.currentDebt.is_complete ? <Text style={styles.debtStatus}>{Strings("label.paid")}</Text> :
                                            <Text style={[styles.debtStatus, { color: "rgb(255, 0, 0)" }]}>{Strings("label.not_paid")}</Text>
                                    }
                                </View>
                                <View>
                                    <Image
                                        style={styles.iconNavigate}
                                        source={require('../../../assets/icons/ic_navigate.png')}
                                    />
                                </View>
                            </Ripple>
                        </View>

                        {
                            this.state.isShowDeveloper ? <View style={styles.setting}>
                                <Ripple
                                    onPress={() => this.props.navigation.navigate("DevelopModeScreen")}
                                    style={styles.developerOptions}
                                >
                                    <Text>Developer options</Text>
                                </Ripple>
                            </View> : null
                        }
                    </View>

                </ScrollView>

                <View style={styles.wrapVersion}>
                    <Text style={styles.version}
                        onPress={() => this.countVersionPressed()}
                    >
                        {
                            Platform.select({
                                ios: (
                                    `${Strings("text.version")} ${VERSION.IOS}`
                                ),
                                android: (
                                    `${Strings("text.version")} ${VERSION.ANDROID}`
                                )
                            })
                        }
                    </Text>
                </View>


                <AppOverlay
                    text={Strings("message.uploading")}
                    isVisible={this.state.isLoading}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    setting: {
        flex: 1,
        marginTop: 50
    },
    developerOptions: {
        borderRadius: 10,
        borderColor: "#d6d6d6",
        borderWidth: 1,
        padding: 8,
        marginHorizontal: normalize(16),
        width: "auto",
        height: 40
    },
    iconSignout: {
        width: "100%",
        height: "100%"
    },
    openEditProfile: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        height: "100%"
    },
    wrapSpiner: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: "center",
        alignItems: "center"
    },
    main: {
        flex: 1,
    },
    userInfo: {
        flex: 1,
        marginHorizontal: 16,
    },
    imgAvatar: {
        resizeMode: "cover",
        borderRadius: 35,
        borderColor: "#d6d6d6",
        borderWidth: 1,
        width: 70,
        height: 70
    },
    iconNavigate: {
        resizeMode: "contain",
        marginLeft: 4,
        width: 20,
        height: 20,
    },
    userHeader: {
        borderBottomColor: "#d6d6d6",
        borderTopColor: "#d6d6d6",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingHorizontal: normalize(14),
        paddingVertical: normalize(14),
        marginVertical: 4,
        alignItems: "center",
        flexDirection: "row"
    },
    userBody: {
        borderBottomColor: "#d6d6d6",
        borderTopColor: "#d6d6d6",
        borderBottomWidth: 1,
        borderTopWidth: 1,
        paddingHorizontal: normalize(14),
    },
    icon: {
        width: 25,
        height: 25,
        resizeMode: "contain"
    },
    moneyKeeped: {
        alignItems: 'center',
        flexDirection: "row",
        paddingVertical: 18,
        borderBottomColor: "#d6d6d6",
        borderBottomWidth: 1,
    },
    historyDebt: {
        alignItems: 'center',
        flexDirection: "row",
        paddingVertical: 18,
    },
    moneyLabel: {
        flex: 1,
        marginHorizontal: 16
    },
    label1: {
        fontWeight: "normal",
        fontSize: normalize(14),
    },
    label2: {
        fontSize: normalize(9),
    },
    textMoneyBlue: {
        fontSize: normalize(16),
        color: "rgb(50, 177, 227)",
        marginRight: 20,
    },
    textMoneyYellow: {
        fontSize: normalize(14),
        color: "rgb(60, 255, 0)",
        marginRight: 20,
    },
    debtStatus: {
        fontSize: normalize(14),
        color: "rgb(106, 177, 197)",
    },
    overlay: {
        width: deviceWidth,
        height: deviceHeight
    },
    container: {
        flex: 1
    },
    headerRight: {
        width: 40,
        height: 40,
        padding: 8,
        borderRadius: 20
    },
    avatar: {
        alignSelf: "center",
        width: 70,
        height: 70,
    },
    name: {
        fontWeight: "normal",
        fontSize: normalize(14),
    },
    email: {
        fontSize: normalize(9),
        color: Colors.colorPrimaryDark,
    },
    phoneNumber: {
        fontSize: normalize(9),
        color: Colors.colorPrimaryDark,
    },
    line: {
        height: 1,
        backgroundColor: "#b7b7b7",
        marginTop: normalize(30),
        marginBottom: normalize(22)
    },
    itemContainer: {
        flexDirection: "row",
        paddingVertical: normalize(10),
        alignItems: 'center'
    },
    itemImageContainer: {
        width: normalize(34),
        marginLeft: normalize(16)
    },
    itemText: {
        fontSize: normalize(15),
        color: Colors.colorBlack
    },
    wrapVersion: {
        width: "100%",
        height: 20,
        position: "absolute",
        marginTop: 4,
        bottom: 4,
    },
    version: {
        flex: 1,
        fontSize: 10,
        textAlign: "center"
    }
});

const mapStateToProps = (state) => {
    return {
        accountReducer: state.accountReducer,
        currentDebt: state.accountReducer.currentDebt,
        userInfo: state.accountReducer.userInfo,
        isLoadingProfile: state.accountReducer.isLoadingProfile,
        isLoadingCurrentDebt: state.accountReducer.isLoadingCurrentDebt,
        isLoadingHistoryDebt: state.accountReducer.isLoadingHistoryDebt
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveUserInformation: (data) => {
            dispatch(saveUserInformation(data))
        },
        clearUserInformation: () => {
            dispatch(clearUserInformation())
        },
        onFetchCurrentDebt: () => {
            dispatch(fetchCurrentDebt())
        },
        onFetchHistoryDebt: () => {
            dispatch(fetchHistoryDebt())
        },
        onFetchProfile: () => {
            dispatch(fetchInfoProfile())
        },
        onLogout: () => {
            dispatch(requestLogout())
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
