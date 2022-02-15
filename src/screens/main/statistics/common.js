import {
  GET_LIST_TRIP_DAY, GET_LIST_TRIP_MONTH, GET_LIST_TRIP_YEAR, FETCH_CHART_DATA_DAY, FETCH_CHART_DATA_MONTH, FETCH_CHART_DATA_YEAR,
  FETCH_MORE_CHART_DATA_DAY, FETCH_MORE_CHART_DATA_MONTH, FETCH_MORE_CHART_DATA_YEAR, UPDATE_DATA_POINT_DAY, UPDATE_DATA_POINT_MONTH,
  UPDATE_DATA_POINT_YEAR, UPDATE_HIGHLIGHT_DAY, UPDATE_HIGHLIGHT_MONTH, UPDATE_HIGHLIGHT_YEAR,
  RESET_SERIAL_DAY,
  RESET_SERIAL_MONTH,
  RESET_SERIAL_YEAR
} from "./StatisticAction";


const PREFIX_TIME = "00:00";
const POSTFIX_TIME = "23:59"

export const DAY = "DAY";
export const MONTH = "MONTH";
export const YEAR = "YEAR";


export const TYPE = {
  DAY: "day",
  MONTH: "month",
  YEAR: "year"
}

export const parseTimerange = (type, time) => {
  switch (type) {
    case "day":
      return {
        time_begin: `${time} ${PREFIX_TIME}`,
        time_end: `${time} ${POSTFIX_TIME}`,
        //serial_before: this.props.serialDay
      }
    case "month":
      let month = time.split('/')[0];
      let year = time.split('/')[1];
      let firstDate = new Date(year, month - 1, 1).getDate();
      let lastDate = new Date(year, month, 0).getDate();
      return {
        time_begin: `${month}/${firstDate}/${year} ${PREFIX_TIME}`,
        time_end: `${month}/${lastDate}/${year} ${POSTFIX_TIME}`,
        //serial_before: this.props.serialMonth
      }
    case "year":
      return {
        time_begin: `01/01/${time} ${PREFIX_TIME}`,
        time_end: `12/31/${time} ${POSTFIX_TIME}`,
        //serial_before: this.props.serialYear
      }
    default:
      return "";
  }
}

export const getKey = (type) => {
  switch (type) {
    case GET_LIST_TRIP_DAY.actionName:
      return DAY;
    case GET_LIST_TRIP_MONTH.actionName:
      return MONTH;
    case GET_LIST_TRIP_YEAR.actionName:
      return YEAR;
  }
}


export const ACTION_NAME = {
  day: FETCH_CHART_DATA_DAY.actionName,
  month: FETCH_CHART_DATA_MONTH.actionName,
  year: FETCH_CHART_DATA_YEAR.actionName
}

export const ACTION_NAME_FETCH_MORE = {
  day: FETCH_MORE_CHART_DATA_DAY.actionName,
  month: FETCH_MORE_CHART_DATA_MONTH.actionName,
  year: FETCH_MORE_CHART_DATA_YEAR.actionName
}

export const UPDATE_DATA_POINT_TYPE = {
  day: UPDATE_DATA_POINT_DAY.actionName,
  month: UPDATE_DATA_POINT_MONTH.actionName,
  year: UPDATE_DATA_POINT_YEAR.actionName
}

export const TYPE_GET_LIST_TRIP = {
  day: GET_LIST_TRIP_DAY.actionName,
  month: GET_LIST_TRIP_MONTH.actionName,
  year: GET_LIST_TRIP_YEAR.actionName
}

export const TYPE_UPDATE_HIGHLIGHT = {
  day: UPDATE_HIGHLIGHT_DAY,
  month: UPDATE_HIGHLIGHT_MONTH,
  year: UPDATE_HIGHLIGHT_YEAR
}

export const TYPE_RESET_LIST_TRIP = {
  day: RESET_SERIAL_DAY,
  month: RESET_SERIAL_MONTH,
  year: RESET_SERIAL_YEAR
}