import { localNotification } from "./utils/NotificationUtils"
import Constants from "./data/Constants"
const BackgroundPushNotification = async (message) => {
	// handle your message
	console.log('Receive Notification from bgMessage', message);
	// localNotification(message)
	return Promise.resolve();
}
export default { BackgroundPushNotification }