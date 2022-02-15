import {createActionSet} from '../../../../utils/ActionHelper';
import Constants from '../../../../data/Constants';

export const REQUEST_ACCEPT_BOOKING = createActionSet('REQUEST_ACCEPT_BOOKING');
export const REQUEST_REASSIGN_DRIVER = createActionSet('REQUEST_REASSIGN_DRIVER');

export const requestAcceptBooking = (data) => ({
	type: REQUEST_ACCEPT_BOOKING.actionName,
	payload: data
});

export const requestReassignDriver = (data) => ({
	type: REQUEST_REASSIGN_DRIVER.actionName,
	payload: data
});
