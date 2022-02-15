import React from 'react';
import CommonNotificationScreen from "../common/CommonNotificationScreen";
import {connect} from "react-redux";
import {fetchCompleted} from "../NotificationAction";
import Constants from "../../../../data/Constants";

const mapStateToProps = (state) => {
	return {
		type: Constants.COMPLETED,
		isLoading: state.notificationReducer.isLoadingCompleted,
		error: state.notificationReducer.errorCompleted,
		dataSource: state.notificationReducer.completedList
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		onFetchData: () => {
			dispatch(fetchCompleted())
		},
		onRequestReadTrip: (data) => {
			dispatch(requestReadTrip(data))
		},
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonNotificationScreen);

