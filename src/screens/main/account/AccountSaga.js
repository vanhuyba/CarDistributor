import { takeLatest, put } from "redux-saga/effects";
import { REQUEST_UPDATE_INFORMATION, REQUEST_CHANGE_PASSWORD, GET_CURRENT_DEBT, GET_HISTORY_DEBT, GET_PROFILE, REQEST_LOGOUT, GET_LIST_TRIP_HISTORY_DEBT } from "./AccountAction";
import * as Api from "../../../data/remote/Api";
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';

function* updateInformation(action) {
    console.log("saga::updateInformation", action);
    try {
        yield put({ type: REQUEST_UPDATE_INFORMATION.LOADING });
        let payload = yield Api.requestUpdateInformation(action.payload);
        yield put({ type: REQUEST_UPDATE_INFORMATION.SUCCESS, payload: action.payload });
        // Toast.show("Success", Toast.SHORT);
    } catch (e) {
        yield put({ type: REQUEST_UPDATE_INFORMATION.ERROR, payload: e.message });
    }
}

function* fetchCurrentDebt() {
    try {
        yield put({ type: GET_CURRENT_DEBT.LOADING });
        let payload = yield Api.fetchCurrentDebt();
        yield put({ type: GET_CURRENT_DEBT.SUCCESS, payload: payload });
    } catch (e) {
        yield put({ type: GET_CURRENT_DEBT.ERROR, payload: e.message });
    }
}

function* fetchHistoryDebt() {
    try {
        yield put({ type: GET_HISTORY_DEBT.LOADING });
        let payload = yield Api.fetchHistoryDebt();
        payload.sort((a, b) => (a.from_time > b.from_time) ? -1 : ((b.from_time > a.from_time) ? 1 : 0));
        yield put({ type: GET_HISTORY_DEBT.SUCCESS, payload: payload });
    } catch (e) {
        yield put({ type: GET_HISTORY_DEBT.ERROR, payload: e.message });
    }
}

function* fetchInfoProfile() {
    try {
        yield put({ type: GET_PROFILE.LOADING });
        let payload = yield Api.fetchInfoUser();
        yield put({ type: GET_PROFILE.SUCCESS, payload: payload.supplier });
    } catch (e) {
        yield put({ type: GET_PROFILE.ERROR, payload: e.message });
    }
}

function* requestLogout() {
    try {
        let payload = yield Api.requestLogout()
        //Toast.show(""+payload.message, Toast.LONG)
    } catch(e){
        console.log("Request logout err", e)
    }
}

function* fetchListTripDetailDebt(action) {
    try {
        yield put({ type: GET_LIST_TRIP_HISTORY_DEBT.LOADING });
        let payload = yield Api.fetchListTripByTime(action.payload);
        yield put({ type: GET_LIST_TRIP_HISTORY_DEBT.SUCCESS, payload: payload.trips });
    } catch (e) {
        yield put({ type: GET_LIST_TRIP_HISTORY_DEBT.ERROR, payload: e.message });
    }
}

function* accountSaga() {
    yield takeLatest(REQUEST_UPDATE_INFORMATION.actionName, updateInformation);
    yield takeLatest(GET_CURRENT_DEBT.actionName, fetchCurrentDebt);
    yield takeLatest(GET_HISTORY_DEBT.actionName, fetchHistoryDebt);
    yield takeLatest(GET_PROFILE.actionName, fetchInfoProfile);
    yield takeLatest(REQEST_LOGOUT.actionName, requestLogout);
    yield takeLatest(GET_LIST_TRIP_HISTORY_DEBT.actionName, fetchListTripDetailDebt);
}

export default accountSaga;
