import {
	
	FETCH_DRIVER,
	FETCH_VEHICLE,
	ADD_DRIVER,
	ADD_VEHICLE,
	DELETE_DRIVER,
	DELETE_VEHICLE,
	UPDATE_DRIVER,
	UPDATE_VEHICLE,
} from "./DriverAction";
import { put, takeLatest } from "redux-saga/effects";
import * as Api from "../../../data/remote/Api";
import Constants from "../../../data/Constants";
import NavigationService from "../../../utils/NavigationService";
import Toast from 'react-native-simple-toast';
import Strings from "../../../utils/LocalizationHelper";

// CRUD driver
function* fetchListDriver(action) {
	try {
		// Dispatch loading
		yield put({ type: FETCH_DRIVER.LOADING });
		// Start fetch list driver
		let payload = yield Api.fetchListDriver();
		console.log(FETCH_DRIVER.SUCCESS, payload);

		// Dispatch Success
		yield put({ type: FETCH_DRIVER.SUCCESS, payload: payload.drivers });
	} catch (e) {
		// Dispatch Error
		Toast.show(e.message, Toast.LONG);
		yield put({ type: FETCH_DRIVER.ERROR, payload: e.message });
	}
}

function* requestAddDriver(action) {
	try {
		yield put({ type: ADD_DRIVER.LOADING });
		let payload = yield Api.requestAddDriver(action.payload);
		console.log("requestAddDriver", payload)
		yield put({ type: ADD_DRIVER.SUCCESS, payload: {...action.payload, id: payload.id} });
		NavigationService.goBack()
		Toast.show(Strings('message.add_driver_success'), Toast.LONG);

	} catch (e) {
		Toast.show(e.message, Toast.LONG);
		yield put({ type: ADD_DRIVER.ERROR, payload: e.message });
	}
}

function* requestDeleteDriver(action) {
	try {
		yield put({ type: DELETE_DRIVER.LOADING });
		let payload = yield Api.requestDeleteDriver(action.payload);
		yield put({ type: DELETE_DRIVER.SUCCESS, payload: action.payload });
		NavigationService.goBack()
		Toast.show(Strings('message.delete_driver_success'), Toast.LONG);
	} catch (e) {
		yield put({ type: DELETE_DRIVER.ERROR, payload: e.message });
		Toast.show(Strings('message.delete_driver_err'), Toast.LONG);
	}
}

function* requestUpdateDriver(action) {
	try {
		yield put({ type: UPDATE_DRIVER.LOADING });
		let payload = yield Api.requestUpdateDriver(action.payload);
		yield put({ type: UPDATE_DRIVER.SUCCESS, payload: action.payload });
		NavigationService.goBack()
		Toast.show(Strings('message.update_driver_success'), Toast.LONG);

	} catch (e) {
		yield put({ type: UPDATE_DRIVER.ERROR, payload: e.message });
		Toast.show(Strings('message.update_driver_err'), Toast.LONG);
	}
}

// CRUD vehicle
function* fetchListVehicle(action) {
	try {
		yield put({ type: FETCH_VEHICLE.LOADING });
		let payload = yield Api.fetchListVehicle();
		console.log(FETCH_VEHICLE.SUCCESS, payload);

		yield put({ type: FETCH_VEHICLE.SUCCESS, payload: payload.vehicles });
	} catch (e) {
		Toast.show(e.message, Toast.LONG);
		yield put({ type: FETCH_VEHICLE.ERROR, payload: e.message });
	}
}


function* requestAddVehicle(action) {
	try {
		yield put({ type: ADD_VEHICLE.LOADING });
		let payload = yield Api.requestAddVehicle(action.payload);
		yield put({ type: ADD_VEHICLE.SUCCESS, payload: {...action.payload, id: payload.id} });
		NavigationService.goBack()
		Toast.show(Strings('message.add_vehicle_success'), Toast.LONG);
		console.log(ADD_VEHICLE.SUCCESS, payload);
	} catch (e) {
		yield put({ type: ADD_VEHICLE.ERROR, payload: e.message });
		Toast.show(e.message, Toast.LONG);

	}
}

function* requestDeleteVehicle(action) {
	try {
		yield put({ type: DELETE_VEHICLE.LOADING });
		let payload = yield Api.requestDeleteVehicle(action.payload);
		yield put({ type: DELETE_VEHICLE.SUCCESS, payload: action.payload });
		Toast.show(Strings('message.delete_vehicle_success'), Toast.LONG);
		NavigationService.goBack()
		console.log(DELETE_VEHICLE.SUCCESS, payload);
	} catch (e) {
		yield put({ type: DELETE_VEHICLE.ERROR, payload: e.message });
		Toast.show(Strings('message.delete_vehicle_err'), Toast.LONG);
	}
}

function* requestUpdateVehicle(action) {
	try {
		yield put({ type: UPDATE_VEHICLE.LOADING });
		let payload = yield Api.requestUpdateVehicle(action.payload);
		yield put({ type: UPDATE_VEHICLE.SUCCESS, payload: action.payload });
		NavigationService.goBack()
		Toast.show(Strings('message.update_vehicle_success'), Toast.LONG);
		console.log(UPDATE_VEHICLE.SUCCESS, payload);
	} catch (e) {
		yield put({ type: UPDATE_VEHICLE.ERROR, payload: e.message });
		Toast.show(Strings('message.update_vehicle_err'), Toast.LONG);

	}
}

function* watchDriverSaga() {
	yield takeLatest(FETCH_DRIVER.actionName, fetchListDriver);
	yield takeLatest(FETCH_VEHICLE.actionName, fetchListVehicle);
	yield takeLatest(ADD_DRIVER.actionName, requestAddDriver);
	yield takeLatest(ADD_VEHICLE.actionName, requestAddVehicle);

	yield takeLatest(DELETE_DRIVER.actionName, requestDeleteDriver);
	yield takeLatest(UPDATE_DRIVER.actionName, requestUpdateDriver);
	yield takeLatest(DELETE_VEHICLE.actionName, requestDeleteVehicle);
	yield takeLatest(UPDATE_VEHICLE.actionName, requestUpdateVehicle);

}

export default watchDriverSaga;
