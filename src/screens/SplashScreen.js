import React, { Component } from 'react';
import { Image, ImageBackground, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import StoreConstant from "../data/StoreConstant";
import { normalize } from "../utils/ViewUtils";
import Constants, { TRIP_TYPE } from "../data/Constants";
import Toast from 'react-native-simple-toast';
import Strings from "../utils/LocalizationHelper";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import { localNotification } from "../utils/NotificationUtils"
import PushNotification from "react-native-push-notification";

import {
	addBooking,
	addConfirm,
	addComplete,
	addUpdate
} from "../screens/main/notification/NotificationAction";
import { connect } from "react-redux";

class SplashScreen extends Component {
	
	async checkLogin() {
		const enabled = await firebase.messaging().hasPermission();
		console.log("Check notification fist time app installed: ", enabled)
		if (enabled === firebase.messaging.AuthorizationStatus.AUTHORIZED || enabled === firebase.messaging.AuthorizationStatus.PROVISIONAL) {
			console.log("CheckFCM hasPermission");
		} else {
			console.log("CheckFCM user doesn't have permission");
			try {
				// provisional allows for notification permission to be instantly granted without displaying a dialog to your user
				const authorizationStatus = await firebase.messaging().requestPermission({
					provisional: true
				});

				if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
					console.log('User has notification permissions enabled.');
				} else if (authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL) {
					console.log('User has provisional notification permissions.');
				} else {
					console.log('User has notification permissions disabled');
				}
			} catch (error) {
				console.log("CheckFCM User has rejected permissions");
			}
			console.log("CheckFCM User doesn't have permission");
		}
		if (!firebase.messaging().isDeviceRegisteredForRemoteMessages) {
			await firebase.messaging().registerDeviceForRemoteMessages();
		}
		firebase.messaging().getToken()
			.then(fcmToken => {
				if (fcmToken) {
					console.log("CheckFCM:::" + fcmToken);
					AsyncStorage.setItem(StoreConstant.FIREBASE_TOKEN, fcmToken)
				} else {
					console.log('user doesnt have a device token yet');
				}
			})
			.catch(reason => {
				console.log(reason);
			});

		console.log("checkLogin");
		try {
			const token = await AsyncStorage.getItem(StoreConstant.TOKEN);
			console.log("CheckToken getToken Success: " + token);
			return token != null;
		} catch (error) {
			console.log("CheckToken getToken Error" + error);
			return false
		}
	}

	async componentDidMount() {
		
		const notificationListenerForeground = firebase.messaging().onMessage(
			async remoteMessage => {
				console.log("notificationListenerForeground::::", remoteMessage)
				// localNotification(remoteMessage)
				let data = remoteMessage.data;
				this.addTripItemToCorrespondingTab(data);

				if (data.type == Constants.NOTIFY_BOOK) {
					if (Platform.OS === "ios") {
						PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
							PushNotificationIOS.setApplicationIconBadgeNumber(num + 1);
						});
					}
				}
			}
		)

		const notificationListenerBackground = firebase.messaging().setBackgroundMessageHandler(async remoteMessage => {
			console.log("FIREBASE_NOTIFICATION_BACKGROUND::11", remoteMessage);
			// localNotification(remoteMessage)

			let data = remoteMessage.data;
			if (data.type == Constants.NOTIFY_BOOK) {
				if (Platform.OS === "ios") {
					PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
						PushNotificationIOS.setApplicationIconBadgeNumber(num + 1);
					});
				}
			}
			this.addTripItemToCorrespondingTab(data);
		});

		/* Remove function to NotificationUtils.onNotification  */
		// const onNotificationOpened = firebase.messaging().onNotificationOpenedApp(async remoteMessage => {
		// 	console.log("FIREBASE_NOTIFICATION_OPENED::");
		// 	this.handleNotificationOpen(JSON.parse(remoteMessage.data.data));
		// });

		setTimeout(() => {
			this.checkLogin().then(isLoggedId => {
				this.props.navigation.navigate(isLoggedId ? "MainNav" : "Login");
			});

		}, 2000);
	}

	addTripItemToCorrespondingTab = async (data) => {
		console.log('FIREBASE::::addTripItemToCorrespondingTab', data);
		data = JSON.parse(data.data)
		switch (data.type) {
			case Constants.NOTIFY_BOOK:
				console.log('FIREBASE::::addTripItemToCorrespondingTab NOTIFY_BOOK', data);
				await this.props.onAddBookingFromNotification(data);
				break;
			case Constants.NOTIFY_ACCEPT:
				Toast.show(Strings("notification.new_confirm"), Toast.LONG);
				console.log('FIREBASE::::addTripItemToCorrespondingTab NOTIFY_ACCEPT', data);
				await this.props.onAddConfirmFromNotification(data);
				break;
			case Constants.NOTIFY_UPDATE:
				Toast.show(Strings("notification.new_update"), Toast.LONG);
				console.log('FIREBASE::::addTripItemToCorrespondingTab NOTIFY_UPDATE', data);
				await this.props.onUpdateFromNotification(data);
				break;
			case Constants.NOTIFY_COMPLETE:
				Toast.show(Strings("notification.new_complete"), Toast.LONG);
				console.log('FIREBASE::::addTripItemToCorrespondingTab NOTIFY_COMPLETE', data);
				await this.props.onAddCompletedFromNotification(data);
				break;
			default:
				break;

		}
	}

	render() {
		return (
			<ImageBackground
				source={require('../assets/icons/bg_login.png')}
				style={{ width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
				imageStyle={{ resizeMode: 'cover' }}
			>
				<Image
					source={require('../assets/icons/ic_app_login.png')}
					style={{
						width: normalize(123),
						height: normalize(94)
					}}
				/>
			</ImageBackground>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onAddBookingFromNotification: (data) => {
			dispatch(addBooking(data))
		},
		onAddConfirmFromNotification: (data) => {
			dispatch(addConfirm(data))
		},
		onAddCompletedFromNotification: (data) => {
			dispatch(addComplete(data))
		},
		onUpdateFromNotification: (data) => {
			dispatch(addUpdate(data));
		}
	};
};

export default connect(null, mapDispatchToProps)(SplashScreen);

