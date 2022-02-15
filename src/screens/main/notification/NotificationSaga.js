import {
	FETCH_BOOKING,
	FETCH_COMPLETED,
	FETCH_CONFIRM,
	REQUEST_CONFIRM_COMPLETE, REQUEST_READ_TRIP
} from "./NotificationAction";
import { put, takeLatest } from "redux-saga/effects";
import * as Api from "../../../data/remote/Api";
import Constants from "../../../data/Constants";
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from "../../../utils/NavigationService";
import Toast from 'react-native-simple-toast';
import Strings from "../../../utils/LocalizationHelper";
import StoreConstant from "../../../data/StoreConstant";

function* fetchNotificationData(action) {
	let type;
	switch (action.dataType) {
		case Constants.BOOKING:
			type = FETCH_BOOKING;
			break;

		case Constants.CONFIRM:
			type = FETCH_CONFIRM;
			break;

		default:
			type = FETCH_COMPLETED;
	}
	try {
		// Dispatch loading
		yield put({ type: type.LOADING });
		// Start fetch Notification Data from Server
		let payload = yield Api.fetchNotificationData(action.dataType);
		console.log(type.SUCCESS, payload);

		// Dispatch Success
		yield put({ type: type.SUCCESS, payload: payload.trips });
	} catch (e) {
		// Dispatch Error
		let message = e.message;
		Toast.show(message, Toast.LONG);
		yield put({ type: type.ERROR, payload: message });
	}
}


function* requestConfirmComplete(action) {
	try {
		// Dispatch loading
		yield put({ type: REQUEST_CONFIRM_COMPLETE.LOADING });

		// Start request Confirm Complete to Server
		let payload = yield Api.requestConfirmComplete(action.payload.data);
		console.log(REQUEST_CONFIRM_COMPLETE.SUCCESS, payload);
		// Dispatch Success
		yield put({ type: REQUEST_CONFIRM_COMPLETE.SUCCESS, payload: action.payload.data });
		Toast.show(Strings('message.confirm_complete_success'), Toast.LONG);
		NavigationService.navigate('Main', "Completed")
	} catch (e) {
		Toast.show(e.message, Toast.LONG);
		console.log(REQUEST_CONFIRM_COMPLETE.ERROR, e.messages);
		yield put({ type: REQUEST_CONFIRM_COMPLETE.ERROR, payload: e.messages });
	}
}

function* requestReadTrip(action) {
	try {
		// Start request Read Trip to Server
		let payload = yield Api.requestReadTrip(action.payload);
		yield put({ type: REQUEST_READ_TRIP.SUCCESS, payload: action.payload });
		console.log(REQUEST_READ_TRIP.SUCCESS, payload);
	} catch (e) {
		console.log(REQUEST_READ_TRIP.ERROR, e.messages);
	}
}

function* watchFetchNotificationData() {
	yield takeLatest(FETCH_BOOKING.actionName, fetchNotificationData);
	yield takeLatest(FETCH_CONFIRM.actionName, fetchNotificationData);
	yield takeLatest(FETCH_COMPLETED.actionName, fetchNotificationData);

	yield takeLatest(REQUEST_CONFIRM_COMPLETE.actionName, requestConfirmComplete);
	yield takeLatest(REQUEST_READ_TRIP.actionName, requestReadTrip);

}

export default watchFetchNotificationData;
