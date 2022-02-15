import {createActionSet} from '../../../utils/ActionHelper';
import Constants from '../../../data/Constants';

export const FETCH_CHART_DATA_DAY = createActionSet('FETCH_CHART_DATA_DAY');
export const FETCH_CHART_DATA_MONTH = createActionSet('FETCH_CHART_DATA_MONTH');
export const FETCH_CHART_DATA_YEAR = createActionSet('FETCH_CHART_DATA_YEAR');

export const UPDATE_DATA_POINT_DAY = createActionSet('UPDATE_DATA_POINT_DAY');
export const UPDATE_DATA_POINT_MONTH = createActionSet('UPDATE_DATA_POINT_MONTH');
export const UPDATE_DATA_POINT_YEAR = createActionSet('UPDATE_DATA_POINT_YEAR');

export const GET_LIST_TRIP_DAY = createActionSet('GET_LIST_TRIP_DAY');
export const GET_LIST_TRIP_MONTH = createActionSet('GET_LIST_TRIP_MONTH');
export const GET_LIST_TRIP_YEAR = createActionSet('GET_LIST_TRIP_YEAR');

export const FETCH_MORE_CHART_DATA_DAY = createActionSet('FETCH_MORE_CHART_DATA_DAY');
export const FETCH_MORE_CHART_DATA_MONTH = createActionSet('FETCH_MORE_CHART_DATA_MONTH');
export const FETCH_MORE_CHART_DATA_YEAR = createActionSet('FETCH_MORE_CHART_DATA_YEAR');

export const RESET_SERIAL_DAY = "RESET_SERIAL_DAY";
export const RESET_SERIAL_MONTH = "RESET_SERIAL_MONTH";
export const RESET_SERIAL_YEAR = "RESET_SERIAL_YEAR";

export const UPDATE_HIGHLIGHT_DAY = "UPDATE_HIGHLIGHT_DAY";
export const UPDATE_HIGHLIGHT_MONTH = "UPDATE_HIGHLIGHT_MONTH";
export const UPDATE_HIGHLIGHT_YEAR = "UPDATE_HIGHLIGHT_YEAR";

export const fetchChartData = (data) => ({
	type: data.actionName,
	payload: data
});

export const fetchMoreChartData = (data) => ({
	type: data.actionName,
	payload: data
});

export const updateDataPoint = (data) => ({
	type: data.actionName,
	payload: data
})

export const getListTripByTime = (data) => ({
	type: data.actionName,
	payload: data
})

export const updateHighligh = (data) => ({
	type: data.actionName,
	payload: data.value
})