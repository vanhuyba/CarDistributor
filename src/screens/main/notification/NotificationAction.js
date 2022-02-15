import {createActionSet} from '../../../utils/ActionHelper';
import Constants from '../../../data/Constants';

export const FETCH_BOOKING = createActionSet('FETCH_BOOKING');
export const FETCH_CONFIRM = createActionSet('FETCH_CONFIRM');
export const FETCH_COMPLETED = createActionSet('FETCH_COMPLETED');
export const REQUEST_ACCEPT_BOOKING = createActionSet('REQUEST_ACCEPT_BOOKING');
export const REQUEST_REASSIGN_DRIVER = createActionSet('REQUEST_REASSIGN_DRIVER');

export const REQUEST_CONFIRM_COMPLETE = createActionSet('REQUEST_CONFIRM_COMPLETE');
export const REQUEST_READ_TRIP = createActionSet('REQUEST_READ_TRIP');

export const FETCH_DRIVER = createActionSet('FETCH_DRIVER');
export const FETCH_VEHICLE = createActionSet('FETCH_VEHICLE');
export const ADD_DRIVER = createActionSet('ADD_DRIVER');
export const ADD_VEHICLE = createActionSet('ADD_VEHICLE');

export const DELETE_VEHICLE = createActionSet('DELETE_VEHICLE');
export const UPDATE_VEHICLE = createActionSet('UPDATE_VEHICLE');
export const DELETE_DRIVER = createActionSet('DELETE_DRIVER');
export const UPDATE_DRIVER = createActionSet('UPDATE_DRIVER');


export const RESET_DETAIL_LOADING_STATE = 'RESET_DETAIL_LOADING_STATE';
export const RESET_DETAIL_ERROR = 'RESET_DETAIL_ERROR';
export const ADD_BOOKING = 'ADD_BOOKING';
export const ADD_CONFIRM = 'ADD_CONFIRM';
export const ADD_COMPLETE = 'ADD_COMPLETE';
export const ADD_UPDATE = "ADD_UPDATE";
export const UPDATE_APP_STATE = 'UPDATE_APP_STATE';

export const fetchBooking = () => ({
	type: FETCH_BOOKING.actionName,
	dataType: Constants.BOOKING
});

export const fetchConfirm = () => ({
	type: FETCH_CONFIRM.actionName,
	dataType: Constants.CONFIRM
});

export const fetchCompleted = () => ({
	type: FETCH_COMPLETED.actionName,
	dataType: Constants.COMPLETED
});

export const requestAcceptBooking = (data) => ({
	type: REQUEST_ACCEPT_BOOKING.actionName,
	payload: data
});

export const requestReassignDriver = (data) => ({
	type: REQUEST_REASSIGN_DRIVER.actionName,
	payload: data
});

export const requestConfirmComplete = (data) => ({
	type: REQUEST_CONFIRM_COMPLETE.actionName,
	payload: data
});

export const requestReadTrip = (data) => ({
	type: REQUEST_READ_TRIP.actionName,
	payload: data
});

export const resetDetailLoadingState = () => ({
	type: RESET_DETAIL_LOADING_STATE
});

export const resetDetailError = () => ({
	type: RESET_DETAIL_ERROR
});

export const addBooking = (data) => ({
	type: ADD_BOOKING,
	payload: data
});

export const addConfirm = (data) => ({
	type: ADD_CONFIRM,
	payload: data
});

export const addComplete = (data) => ({
	type: ADD_COMPLETE,
	payload: data
});

export const addUpdate = (data) => ({
    type: ADD_UPDATE,
    payload: data
});




