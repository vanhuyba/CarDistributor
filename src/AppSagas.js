import watchFetchNotificationData from "./screens/main/notification/NotificationSaga";
import accountSaga from "./screens/main/account/AccountSaga";
import watchFetchChartData from "./screens/main/statistics/StatisticSaga";
import watchAssignDriverData from "./screens/main/notification/assigndriver/AssignDriverSaga"
import watchDriverSaga from "./screens/main/driver/DriverSaga"
import {call, all} from 'redux-saga/effects';

export default function* rootSaga() {
    yield all([watchFetchNotificationData(), accountSaga(), watchFetchChartData(), watchAssignDriverData(), watchDriverSaga()]);
}
