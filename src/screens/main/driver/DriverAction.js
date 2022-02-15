import {createActionSet} from '../../../utils/ActionHelper';

export const FETCH_DRIVER = createActionSet('FETCH_DRIVER');
export const FETCH_VEHICLE = createActionSet('FETCH_VEHICLE');
export const ADD_DRIVER = createActionSet('ADD_DRIVER');
export const ADD_VEHICLE = createActionSet('ADD_VEHICLE');

export const DELETE_VEHICLE = createActionSet('DELETE_VEHICLE');
export const UPDATE_VEHICLE = createActionSet('UPDATE_VEHICLE');
export const DELETE_DRIVER = createActionSet('DELETE_DRIVER');
export const UPDATE_DRIVER = createActionSet('UPDATE_DRIVER');

export const fetchDriver = () => ({
	type: FETCH_DRIVER.actionName
});

export const fetchVehicle = () => ({
	type: FETCH_VEHICLE.actionName
});

export const requestAddDriver = (data) => ({
	type: ADD_DRIVER.actionName,
	payload: data
});

export const requestAddVehicle = (data) => ({
	type: ADD_VEHICLE.actionName,
	payload: data
});

export const requestUpdateDriver = (data) => ({
	type: UPDATE_DRIVER.actionName,
	payload: data
});

export const requestDeleteDriver = (data) => ({
	type: DELETE_DRIVER.actionName,
	payload: data
});

export const requestUpdateVehicle = (data) => ({
	type: UPDATE_VEHICLE.actionName,
	payload: data
});

export const requestDeleteVehicle = (data) => ({
	type: DELETE_VEHICLE.actionName,
	payload: data
});


