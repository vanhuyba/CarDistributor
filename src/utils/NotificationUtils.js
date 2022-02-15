import { getScreenByNotifyType } from "./Utils";
import AsyncStorage from '@react-native-community/async-storage';
import Constants, { TRIP_TYPE } from "../data/Constants";
import Strings, { setI18nConfig } from "./LocalizationHelper";
import NavigationService from "./NavigationService";

import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

const handleNotificationOpen = async (data) => {
	// Get information about the notification that was opened
	data = JSON.parse(data.data);
	var type = getScreenByNotifyType(data.type);
	console.log('FIREBASE::::onNotificationOpened Type', type);
	if(Boolean(type)){
		if (data.trip_type === TRIP_TYPE.DELIVERY) {
		NavigationService.navigate('DeliveryDetail', "", {
			type: type,
			data: data
		});
		} else {
			NavigationService.navigate('NotificationDetail', "", {
				type: type,
				data: data
			});
		}
	}

}
export const localNotification = (remoteMessage) => {
	PushNotification.createChannel(
		{
			channelId: "upde_supplier_sound_notification", // (required)
			channelName: "Upde Supplier Notification", // (required)
			channelDescription: "Upde Supplier Notification", // (optional) default: undefined.
			//soundName: "upde.mp3", // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
			vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
		},
		(created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
	);

	PushNotification.getChannels(function (channels) {
		console.log("Channel11::", channels);
	});




	const notification = remoteMessage.notification;

	PushNotification.localNotification({
		/* Android Only Properties */
		data: JSON.parse(remoteMessage.data.data),
		channelId: 'upde_supplier_sound_notification',
		vibrate: true, // (optional) default: true
		vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
		ongoing: false, // (optional) set whether this is an "ongoing" notification
		priority: "high", // (optional) set notification priority, default: high
		visibility: "private", // (optional) set notification visibility, default: private
		ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
		invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true
		color: "red",
		/* iOS and Android properties */
		title: notification.title, // (optional)
		message: notification.body, // (required)
		number: "1", // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
	});

}

export const configure = async() => {
	// Must be outside of any component LifeCycle (such as `componentDidMount`).

	PushNotification.configure({
		// (optional) Called when Token is generated (iOS and Android)
		onRegister: function (token) {
			console.log("TOKEN:", token);
		},

		// (required) Called when a remote is received or opened, or local notification is opened
		onNotification: function (notification) {
			// process the notification
			handleNotificationOpen(notification.data)
			// (required) Called when a remote is received or opened, or local notification is opened
			notification.finish(PushNotificationIOS.FetchResult.NoData);
		},

		// (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
		onAction: function (notification) {
			console.log("ACTION:", notification.action);
			console.log("NOTIFICATION:", notification);

			// process the action
		},

		// (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
		onRegistrationError: function (err) {
			console.error(err.message, err);
		},

		// IOS ONLY (optional): default: all - Permissions to register.
		permissions: {
			alert: true,
			badge: true,
			sound: true,
		},

		// Should the initial notification be popped automatically
		// default: true
		popInitialNotification: true,

		/**
		 * (optional) default: true
		 * - Specified if permissions (ios) and token (android and ios) will requested or not,
		 * - if not, you must call PushNotificationsHandler.requestPermissions() later
		 * - if you are not using remote notification or do not have Firebase installed, use this:
		 *     requestPermissions: Platform.OS === 'ios'
		 */
		requestPermissions: true,
	});
};
