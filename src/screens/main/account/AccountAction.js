import {createActionSet} from "../../../utils/ActionHelper";

export const REQUEST_UPDATE_INFORMATION = createActionSet('REQUEST_UPDATE_INFORMATION');
export const REQUEST_CHANGE_PASSWORD = createActionSet('CHANGE_PASSWORD');
export const GET_LIST_TRIP_HISTORY_DEBT = createActionSet('GET_LIST_TRIP_HISTORY_DEBT');
export const SAVE_INFORMATION = "SAVE_INFORMATION";
export const CLEAR_INFORMATION = "CLEAR_INFORMATION";

export const GET_CURRENT_DEBT = createActionSet('GET_CURRENT_DEBT');
export const GET_HISTORY_DEBT = createActionSet('GET_HISTORY_DEBT');
export const GET_PROFILE = createActionSet('GET_PROFILE');
export const REQEST_LOGOUT = createActionSet('REQEST_LOGOUT');

export const requestUpdateInformation = (data) => ({
    type: REQUEST_UPDATE_INFORMATION.actionName,
    payload: data
});

export const saveUserInformation = (userInfo) => ({
    type: SAVE_INFORMATION,
    payload: userInfo
});

export const clearUserInformation = () => ({
    type: CLEAR_INFORMATION
});

export const fetchCurrentDebt = () => ({
	type: GET_CURRENT_DEBT.actionName
});

export const fetchHistoryDebt = () => ({
	type: GET_HISTORY_DEBT.actionName
});

export const fetchInfoProfile = () => ({
    type: GET_PROFILE.actionName
})

export const requestLogout = () => ({
    type: REQEST_LOGOUT.actionName
})

export const getListTripHistoryByMonth = (data) => ({
	type: data.actionName,
	payload: data
})