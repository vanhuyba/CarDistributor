/**
 * @format
 */

import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import BackgroundTask from "./src/BackgroundTask";
import firebase from "firebase"
import { FIREBASE_DB_CONFIG } from './src/data/Constants';
import { configure } from "./src/utils/NotificationUtils"
configure()
//firebase.initializeApp(FIREBASE_DB_CONFIG);

AppRegistry.registerComponent(appName, () => App);

// New task registration
// AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => BackgroundMessaging);
AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => BackgroundTask.BackgroundPushNotification);
