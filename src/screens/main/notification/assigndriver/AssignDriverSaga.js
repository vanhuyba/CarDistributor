import {
	REQUEST_ACCEPT_BOOKING,
	REQUEST_REASSIGN_DRIVER,
} from "./AssignDriverAction";
import {put, takeLatest} from "redux-saga/effects";
import * as Api from "../../../../data/remote/Api";
import Constants from "../../../../data/Constants";
import NavigationService from "../../../../utils/NavigationService";
import Toast from 'react-native-simple-toast';
import Strings from "../../../../utils/LocalizationHelper";


function* requestAcceptBooking(action) {
	try {
		// Dispatch loading
		yield put({type: REQUEST_ACCEPT_BOOKING.LOADING});

		// Start request Accept Booking to Server
		let payload = yield Api.requestAcceptBooking(action.payload);
		console.log(REQUEST_ACCEPT_BOOKING.SUCCESS, payload);

		// Dispatch Success
		yield put({type: REQUEST_ACCEPT_BOOKING.SUCCESS, payload: payload.data});
		Toast.show(Strings('message.accept_booking_success'), Toast.LONG);
    NavigationService.navigate('Main', "Confirm")
	} catch (e) {
		// Dispatch Error
		Toast.show(e.message, Toast.LONG);
		console.log(REQUEST_ACCEPT_BOOKING.ERROR, e.messages);
		yield put({type: REQUEST_ACCEPT_BOOKING.ERROR, payload: e.messages});
	}
}

function* requestReassignDriver(action) {
	try {
		// Dispatch loading
		yield put({type: REQUEST_REASSIGN_DRIVER.LOADING});

		// Start request Accept Booking to Server
		let payload = yield Api.reassignDriver(action.payload);
		console.log(REQUEST_REASSIGN_DRIVER.SUCCESS, payload);

		// Dispatch Success
		yield put({type: REQUEST_REASSIGN_DRIVER.SUCCESS, payload: action.payload});
		Toast.show(Strings('message.reassign_driver_success'), Toast.LONG);
    NavigationService.navigate('Main')

	} catch (e) {
		// Dispatch Error
		Toast.show(e.message, Toast.LONG);
		console.log(REQUEST_REASSIGN_DRIVER.ERROR, e.messages);
		yield put({type: REQUEST_REASSIGN_DRIVER.ERROR, payload: e.messages});
	}
}


function* watchAssignDriverData() {
	yield takeLatest(REQUEST_ACCEPT_BOOKING.actionName, requestAcceptBooking);
	yield takeLatest(REQUEST_REASSIGN_DRIVER.actionName, requestReassignDriver);

}

export default watchAssignDriverData;
