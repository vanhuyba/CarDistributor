import {
	requestReassignDriver,
	requestAcceptBooking,
	requestConfirmComplete,
	resetDetailError,
	resetDetailLoadingState,
} from "../NotificationAction";

import { fetchDriver, fetchVehicle} from "../../driver/DriverAction"

import { connect } from "react-redux";
import CommonNotificationDetailScreen from "./CommonNotificationDetailScreen";
import DeliveryNotificationDetailScreen from "../delivery/DeliveryNotificationDetailScreen";

const mapStateToProps = (state) => {
	return {
		isLoading: state.notificationReducer.isLoadingRequest,
		error: state.notificationReducer.errorRequest,
		driverList: state.notificationReducer.driverList,
		vehicleList: state.notificationReducer.vehicleList,
		driverIndex: state.notificationReducer.driverIndex,
		vehicleIndex: state.notificationReducer.vehicleIndex,
		indexSedan: state.notificationReducer.indexSedan,
		indexSuv: state.notificationReducer.indexSuv,
		indexMinivan: state.notificationReducer.indexMinivan,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		requestReassignDriver: (data) => {
			dispatch(requestReassignDriver(data))
		},
		requestAcceptBooking: (data) => {
			dispatch(requestAcceptBooking(data))
		},
		requestConfirmComplete: (data) => {
			dispatch(requestConfirmComplete(data))
		},
		resetDetailState: () => {
			dispatch(resetDetailLoadingState());
			dispatch(resetDetailError());
		},
		onFetchDataDriver: () => {
			dispatch(fetchDriver());
		},
		onFetchVehicles: () => {
			dispatch(fetchVehicle())
		}
	};
};

export default {
	UpdeTripScreen: connect(mapStateToProps, mapDispatchToProps)(CommonNotificationDetailScreen),
	DeliveryScreen: connect(mapStateToProps, mapDispatchToProps)(DeliveryNotificationDetailScreen)
};
