import React from 'react';
import {connect} from 'react-redux';
import CommonNotificationScreen from "../common/CommonNotificationScreen";
import {addBooking, addComplete, addConfirm, fetchBooking, addUpdate, requestReadTrip} from "../NotificationAction";
import Constants from "../../../../data/Constants";

const mapStateToProps = (state) => {
  return {
    type: Constants.BOOKING,
    isLoading: state.notificationReducer.isLoadingBooking,
    error: state.notificationReducer.errorBooking,
    dataSource: state.notificationReducer.bookingList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchData: () => {
      dispatch(fetchBooking())
    },
		onRequestReadTrip: (data) => {
			dispatch(requestReadTrip(data))
		},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonNotificationScreen);

