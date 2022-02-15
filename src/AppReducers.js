import {combineReducers} from "redux";
import {notificationReducer} from "./screens/main/notification/NotificationReducer";
import accountReducer from "./screens/main/account/AccountReducer";
import {statisticReducer} from "./screens/main/statistics/StatisticReducer";
import { driverReducer } from "./screens/main/driver/DriverReducer";
export const rootReducer = combineReducers({
	notificationReducer,
    accountReducer,
    statisticReducer,
    driverReducer
});
