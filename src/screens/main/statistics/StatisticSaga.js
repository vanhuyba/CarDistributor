import { put, takeLatest } from "redux-saga/effects";
import { parseTimerange, TYPE, TYPE_RESET_LIST_TRIP } from "./common"
import {
  FETCH_CHART_DATA_DAY, FETCH_CHART_DATA_MONTH, FETCH_CHART_DATA_YEAR, GET_LIST_TRIP_DAY, GET_LIST_TRIP_MONTH, GET_LIST_TRIP_YEAR,
  FETCH_MORE_CHART_DATA_DAY, FETCH_MORE_CHART_DATA_MONTH, FETCH_MORE_CHART_DATA_YEAR, RESET_SERIAL_DAY, RESET_SERIAL_MONTH, RESET_SERIAL_YEAR
} from "./StatisticAction"
import * as Api from "../../../data/remote/Api";
import Toast from 'react-native-simple-toast';

// fetch data chart
function* fetchChartData(action) {
  const actionType = action.type
  var type, fetchListType;
  switch (actionType) {
    case FETCH_CHART_DATA_DAY.actionName:
      type = FETCH_CHART_DATA_DAY;
      fetchListType = TYPE.DAY;
      break;
    case FETCH_CHART_DATA_MONTH.actionName:
      type = FETCH_CHART_DATA_MONTH;
      fetchListType = TYPE.MONTH;
      break;
    case FETCH_CHART_DATA_YEAR.actionName:
      type = FETCH_CHART_DATA_YEAR;
      fetchListType = TYPE.YEAR;
      break;
    default:
      break;
  }
  try {
    // Dispatch loading
    yield put({ type: type.LOADING });
    // Start fetch Notification Data from Server
    let payload = yield Api.fetchDataChart(action.payload);
    // Dispatch Success
    yield put({ type: type.SUCCESS, payload: payload.data.reverse() });
    let chartData = payload.data;
    let length = chartData.length;

    if (length > 0) {
      let actionTypeGetList = GET_LIST_TRIP_DAY.actionName;
      let actionTypeResetList = RESET_SERIAL_DAY;
      if (fetchListType === TYPE.MONTH) {
        actionTypeGetList = GET_LIST_TRIP_MONTH.actionName;
        actionTypeResetList = RESET_SERIAL_MONTH;
      } else if (fetchListType === TYPE.YEAR) {
        actionTypeGetList = GET_LIST_TRIP_YEAR.actionName
        actionTypeResetList = RESET_SERIAL_YEAR;
      }
      yield put({ type: actionTypeResetList })
      let lastRecord = chartData[length - 1];
      let timeRange = parseTimerange(fetchListType, lastRecord.time)
      yield put({ type: actionTypeGetList, payload: { ...timeRange, serial_before: 999999999 } })
    }

  } catch (e) {
    // Dispatch Error
    let message = e.message;
    Toast.show(message, Toast.LONG);
    yield put({ type: type.ERROR, payload: message });
  }
}


// fetch more data chart
function* fetchMoreChartData(action) {
  const actionType = action.type
  var type;
  switch (actionType) {
    case FETCH_MORE_CHART_DATA_DAY.actionName:
      type = FETCH_MORE_CHART_DATA_DAY;
      break;
    case FETCH_MORE_CHART_DATA_MONTH.actionName:
      type = FETCH_MORE_CHART_DATA_MONTH;
      break;
    case FETCH_MORE_CHART_DATA_YEAR.actionName:
      type = FETCH_MORE_CHART_DATA_YEAR;
      break;
    default:
      break;
  }
  try {
    // Dispatch loading
    yield put({ type: type.LOADING });
    // Start fetch Notification Data from Server
    let payload = yield Api.fetchDataChart(action.payload);
    // Dispatch Success
    yield put({ type: type.SUCCESS, payload: payload.data.reverse() });
  } catch (e) {
    // Dispatch Error
    let message = e.message;
    Toast.show(message, Toast.LONG);
    yield put({ type: type.ERROR, payload: message });
  }
}

function* getListTripByTime(action) {
  console.log("getListTripByTime", action)
  const actionType = action.type
  var type;
  switch (actionType) {
    case GET_LIST_TRIP_DAY.actionName:
      type = GET_LIST_TRIP_DAY;
      break;
    case GET_LIST_TRIP_MONTH.actionName:
      type = GET_LIST_TRIP_MONTH;
      break;
    case GET_LIST_TRIP_YEAR.actionName:
      type = GET_LIST_TRIP_YEAR;
      break;
    default:
      break;
  }
  try {
    // Dispatch loading
    yield put({ type: type.LOADING });
    // Start fetch Notification Data from Server
    let payload = yield Api.fetchListTripByTime(action.payload);
    console.log("fetchListTripByTime success", payload)
    // Dispatch Success
    yield put({ type: type.SUCCESS, payload: payload.trips });
  } catch (e) {
    // Dispatch Error
    console.log("fetchListTripByTime err")
    let message = e.message;
    Toast.show(message, Toast.LONG);
    yield put({ type: type.ERROR, payload: message });
  }
}


function* watchFetchChartData() {
  yield takeLatest(FETCH_CHART_DATA_DAY.actionName, fetchChartData);
  yield takeLatest(FETCH_CHART_DATA_MONTH.actionName, fetchChartData);
  yield takeLatest(FETCH_CHART_DATA_YEAR.actionName, fetchChartData);
  yield takeLatest(GET_LIST_TRIP_DAY.actionName, getListTripByTime);
  yield takeLatest(GET_LIST_TRIP_MONTH.actionName, getListTripByTime);
  yield takeLatest(GET_LIST_TRIP_YEAR.actionName, getListTripByTime);
  yield takeLatest(FETCH_MORE_CHART_DATA_DAY.actionName, fetchMoreChartData);
  yield takeLatest(FETCH_MORE_CHART_DATA_MONTH.actionName, fetchMoreChartData);
  yield takeLatest(FETCH_MORE_CHART_DATA_YEAR.actionName, fetchMoreChartData);
}

export default watchFetchChartData;
