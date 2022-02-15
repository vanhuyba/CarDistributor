import {
    REQUEST_UPDATE_INFORMATION,
    REQUEST_CHANGE_PASSWORD,
    SAVE_INFORMATION,
    CLEAR_INFORMATION,
    GET_CURRENT_DEBT,
    GET_HISTORY_DEBT,
    GET_PROFILE,
    GET_LIST_TRIP_HISTORY_DEBT
} from "./AccountAction";
import { AsyncStorage } from "react-native";

export const initState = {
    actionType: '',
    updateInformation: {
        isLoading: false,
        success: false,
        data: null,
        message: ''
    },
    currentDebt: {
        moneyKeeped: 0,
        sum: 0
    },
    isLoadingCurrentDebt: false,
    historyDebt: [],
    isLoadingHistoryDebt: false,
    isLoadingProfile: false,
    userInfo: {
        "name": "",
        "avatar": "",
        "phoneNumber": "",
        "address": "",
        "airport_symbol": "",
        "email": "",
    },
    isLoadingProfile: false,

    listTripDetailDebt: [],
    isLoadingDetailDebt: false,
};

export default (state = initState, action) => {
    let newState = { ...state };
    newState['action'] = action.type;
    console.log("newState", newState, action);
    switch (action.type) {
        case SAVE_INFORMATION:
            let info = newState["userInfo"];
            console.log("xxxxxxx", action.payload)
            info = {
                ...info,
                avatar: action.payload.avatar
            }
            // let keys = Object.keys(action.payload);
            // for (let idx = 0; idx < keys.length; idx += 1) {
            //     info[keys[idx]] = action.payload[keys[idx]];
            // }
            newState["userInfo"] = info;
            return newState;
        case CLEAR_INFORMATION:
            newState["userInfo"] = {};
            return newState;
        case REQUEST_UPDATE_INFORMATION.LOADING:
            newState['updateInformation'] = {
                isLoading: true,
                success: false,
                data: null,
                message: ""
            };
            console.log("Reducer::", newState);

            return newState;
        case REQUEST_UPDATE_INFORMATION.SUCCESS:
            let data = action ? action.payload : null;
            newState["updateInformation"] = {
                isLoading: false,
                success: true,
                data: data,
                message: action.data ? action.data.message : ""
            };
            let userInfo = newState["userInfo"];
            userInfo = {
                ...userInfo,
                name: action.payload.name,
                phoneNumber: action.payload.phoneNumber
            };
            newState["userInfo"] = userInfo;
            console.log("Reducer::", newState);

            return newState;
        case REQUEST_UPDATE_INFORMATION.ERROR:
            newState["updateInformation"] = {
                isLoading: false,
                success: false,
                data: null,
                message: action.message
            };
            console.log("Reducer::", newState);

            return newState;
        case GET_CURRENT_DEBT.LOADING:
            return {
                ...state,
                isLoadingCurrentDebt: true,
            }
        case GET_CURRENT_DEBT.ERROR:
            return {
                ...state,
                isLoadingCurrentDebt: false,
            }

        case GET_CURRENT_DEBT.SUCCESS:
            return {
                ...state,
                isLoadingCurrentDebt: false,
                currentDebt: action.payload
            }

        case GET_HISTORY_DEBT.LOADING:
            return {
                ...state,
                isLoadingHistoryDebt: true,
            }
        case GET_HISTORY_DEBT.ERROR:
            return {
                ...state,
                isLoadingHistoryDebt: false,
            }

        case GET_HISTORY_DEBT.SUCCESS:
            return {
                ...state,
                isLoadingHistoryDebt: false,
                historyDebt: action.payload
            }

        case GET_PROFILE.LOADING:
            return {
                ...state,
                isLoadingProfile: true,
            }
        case GET_PROFILE.ERROR:
            return {
                ...state,
                isLoadingProfile: false,
            }

        case GET_PROFILE.SUCCESS:
            return {
                ...state,
                isLoadingProfile: false,
                userInfo: action.payload
            }

        case GET_LIST_TRIP_HISTORY_DEBT.LOADING:
            return {
                ...state,
                isLoadingDetailDebt: true,
            }
            
        case GET_LIST_TRIP_HISTORY_DEBT.SUCCESS:
            return {
                ...state,
                isLoadingDetailDebt: false,
                listTripDetailDebt: action.payload
            }

        case GET_LIST_TRIP_HISTORY_DEBT.ERROR:
            return {
                ...state,
                isLoadingDetailDebt: false,
            }
        default:
            return newState;
    }
};
