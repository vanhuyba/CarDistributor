import React from 'react';
import CommonNotificationScreen from "../common/CommonNotificationScreen";
import {connect} from "react-redux";
import {addBooking, addConfirm, fetchConfirm, requestReadTrip} from "../NotificationAction";
import Constants from "../../../../data/Constants";

const mapStateToProps = (state) => {
	return {
		type: Constants.CONFIRM,
		isLoading: state.notificationReducer.isLoadingConfirm,
		error: state.notificationReducer.errorConfirm,
		dataSource: state.notificationReducer.confirmList
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchData: () => {
			dispatch(fetchConfirm())
		},	
		onRequestReadTrip: (data) => {
			dispatch(requestReadTrip(data))
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonNotificationScreen);



