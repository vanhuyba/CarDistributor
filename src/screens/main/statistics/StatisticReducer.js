import {
  FETCH_CHART_DATA_DAY,
  FETCH_CHART_DATA_MONTH,
  FETCH_CHART_DATA_YEAR,
  UPDATE_DATA_POINT_DAY,
  UPDATE_DATA_POINT_MONTH,
  UPDATE_DATA_POINT_YEAR,
  GET_LIST_TRIP_DAY,
  GET_LIST_TRIP_MONTH,
  GET_LIST_TRIP_YEAR,
  RESET_SERIAL_DAY,
  RESET_SERIAL_MONTH,
  RESET_SERIAL_YEAR,
  FETCH_MORE_CHART_DATA_DAY,
  FETCH_MORE_CHART_DATA_MONTH,
  FETCH_MORE_CHART_DATA_YEAR,
  UPDATE_HIGHLIGHT_DAY, UPDATE_HIGHLIGHT_MONTH, UPDATE_HIGHLIGHT_YEAR,
} from "./StatisticAction"

import { CHART_PAGE_SIZE } from "../../../data/Constants"

const SAMPLE_CHART_DATA_POINT = {
  "time": "",
  "price": 0,
  "number_trip": 0
}

var SAMPLE_CHART_DATA_DAY = [];
var SAMPLE_CHART_DATA_MONTH = [];
var SAMPLE_CHART_DATA_YEAR = [];

for (let i = 0; i < 14 * CHART_PAGE_SIZE; i++) {
  SAMPLE_CHART_DATA_DAY.push(SAMPLE_CHART_DATA_POINT);
  SAMPLE_CHART_DATA_MONTH.push(SAMPLE_CHART_DATA_POINT);
  SAMPLE_CHART_DATA_YEAR.push(SAMPLE_CHART_DATA_POINT);

}

for (let i = 0; i < 14; i++) {
  SAMPLE_CHART_DATA_YEAR.push(SAMPLE_CHART_DATA_POINT);
}


const INIT_SERIAL = 999999999;
const INIT_CHART_PAGE_INDEX = 0;  //0-14, 1-28 .v.v
const INIT_HIGHLIGHT = 13;
export const initState = {
  //Chart data
  chartDataDay: SAMPLE_CHART_DATA_DAY,
  currentDataPointDay: {
    time: "",
    price: 0,
    number_trip: 0
  },
  listTripByDay: [],
  serialDay: INIT_SERIAL,
  numberDay: INIT_CHART_PAGE_INDEX,
  isLoadMoreChartDay: false,
  isLoadingChartDataDay: false,
  zoomChart: { scaleX: 5, scaleY: 1, xValue: CHART_PAGE_SIZE * 14, yValue: 0, axisDependency: 'LEFT' },
  highlightDay: 0,

  chartDataMonth: SAMPLE_CHART_DATA_MONTH,
  currentDataPointMonth: {
    time: "",
    price: 0,
    number_trip: 0
  },
  listTripByMonth: [],
  serialMonth: INIT_SERIAL,
  numberMonth: INIT_CHART_PAGE_INDEX,
  isLoadMoreChartMonth: false,
  isLoadingChartDataMonth: false,
  highlightMonth: 0,

  chartDataYear: SAMPLE_CHART_DATA_YEAR,
  currentDataPointYear: {
    time: "",
    price: 0,
    number_trip: 0
  },
  listTripByYear: [],
  serialYear: INIT_SERIAL,
  numberYear: INIT_CHART_PAGE_INDEX,
  isLoadMoreChartYear: false,
  isLoadingChartDataYear: false,
  highlightYear: 0,

  //common isLoading
  isLoadingDataStatistic: false

}
export const statisticReducer = (state = initState, action = {}) => {
  console.log("On statisticReducer", action, action.type, action.payload);
  switch (action.type) {
    case FETCH_CHART_DATA_DAY.LOADING:
      return {
        ...state,
        isLoadingDataStatistic: true,
        isLoadingChartDataDay: true,
      };
    case GET_LIST_TRIP_DAY.LOADING:
    case GET_LIST_TRIP_MONTH.LOADING:
    case GET_LIST_TRIP_YEAR.LOADING:
      return {
        ...state,
        isLoadingDataStatistic: true,
      };
    case FETCH_CHART_DATA_DAY.ERROR:
      return {
        ...state,
        isLoadingDataStatistic: false,
        isLoadingChartDataDay: false
      };
    case GET_LIST_TRIP_DAY.ERROR:
    case GET_LIST_TRIP_MONTH.ERROR:
    case GET_LIST_TRIP_YEAR.ERROR:
      return {
        ...state,
        isLoadingDataStatistic: false,
      };
    case FETCH_CHART_DATA_DAY.SUCCESS:
      state.chartDataDay.splice((CHART_PAGE_SIZE - 1) * 14, 14)
      state.chartDataDay.splice((CHART_PAGE_SIZE - 1) * 14, 0, ...action.payload);

      return {
        ...state,
        //chartDataDay: [...SAMPLE_CHART_DATA_DAY, ...state.chartDataDay], // concat start of array
        numberDay: 1,
        isLoadingDataStatistic: false,
        currentDataPointDay: action.payload[INIT_HIGHLIGHT],
        isLoadingChartDataDay: false,
        highlightDay: CHART_PAGE_SIZE * 14 -1
      };
    case FETCH_CHART_DATA_MONTH.LOADING:
      return {
        ...state,
        isLoadingChartDataMonth: true,
        isLoadingDataStatistic: true
      };
    case FETCH_CHART_DATA_MONTH.ERROR:
      return {
        ...state,
        isLoadingDataStatistic: false,
        isLoadingChartDataMonth: false
      };
    case FETCH_CHART_DATA_MONTH.SUCCESS:
      state.chartDataMonth.splice((CHART_PAGE_SIZE - 1) * 14, 14)
      state.chartDataMonth.splice((CHART_PAGE_SIZE - 1) * 14, 0, ...action.payload);
      return {
        ...state,
        //chartDataMonth: action.payload,
        numberMonth: 1,
        isLoadingDataStatistic: false,
        currentDataPointMonth: action.payload[INIT_HIGHLIGHT],
        isLoadingChartDataMonth: false,
        highlightMonth: CHART_PAGE_SIZE * 14 -1

      };
    case FETCH_CHART_DATA_YEAR.LOADING:
      return {
        ...state,
        isLoadingDataStatistic: true,
        isLoadingChartDataYear: true,
      };
    case FETCH_CHART_DATA_YEAR.ERROR:
      return {
        ...state,
        isLoadingDataStatistic: false,
        isLoadingChartDataYear: false,
      };
    case FETCH_CHART_DATA_YEAR.SUCCESS:
      // state.chartDataYear.splice((CHART_PAGE_SIZE - 1) * 14, 14)
      // state.chartDataYear.splice((CHART_PAGE_SIZE - 1) * 14, 0, ...action.payload);
      return {
        ...state,
        chartDataYear: action.payload,
        numberYear: 1,
        isLoadingDataStatistic: false,
        currentDataPointYear: action.payload[INIT_HIGHLIGHT],
        isLoadingChartDataYear: false,
        highlightYear: INIT_HIGHLIGHT
      };
    case UPDATE_DATA_POINT_DAY.actionName:
      return {
        ...state,
        currentDataPointDay: action.payload
      }
    case UPDATE_DATA_POINT_MONTH.actionName:
      return {
        ...state,
        currentDataPointMonth: action.payload
      }
    case UPDATE_DATA_POINT_YEAR.actionName:
      return {
        ...state,
        currentDataPointYear: action.payload
      }

    case GET_LIST_TRIP_DAY.SUCCESS:
      var payload = action.payload;
      var length = payload.length;
      var serial = 0;
      if (length > 0) {
        serial = payload[length - 1].serial
      }
      return {
        ...state,
        isLoadingDataStatistic: false,
        listTripByDay: state.serialDay !== INIT_SERIAL ? [
          ...state.listTripByDay,
          ...action.payload
        ] : action.payload,
        serialDay: serial
      }
    case GET_LIST_TRIP_MONTH.SUCCESS:
      var payload = action.payload;
      var length = payload.length;
      var serial = 0;
      if (length > 0) {
        serial = payload[length - 1].serial
      }
      return {
        ...state,
        isLoadingDataStatistic: false,
        listTripByMonth: state.serialMonth !== INIT_SERIAL ? [
          ...state.listTripByMonth,
          ...action.payload
        ] : action.payload,
        serialMonth: serial
      }
    case GET_LIST_TRIP_YEAR.SUCCESS:
      var payload = action.payload;
      var length = payload.length;
      var serial = 0;
      if (length > 0) {
        serial = payload[length - 1].serial
      }
      return {
        ...state,
        isLoadingDataStatistic: false,
        listTripByYear: state.serialYear !== INIT_SERIAL ? [
          ...state.listTripByYear,
          ...action.payload
        ] : action.payload,
        serialYear: serial

      }

    case RESET_SERIAL_DAY:
      return {
        ...state,
        listTripByDay: [],
        serialDay: INIT_SERIAL
      }
    case RESET_SERIAL_MONTH:
      return {
        ...state,
        listTripByMonth: [],
        serialMonth: INIT_SERIAL
      }
    case RESET_SERIAL_YEAR:
      return {
        ...state,
        listTripByYear: [],
        serialYear: INIT_SERIAL
      }

    case FETCH_MORE_CHART_DATA_DAY.LOADING:
      return {
        ...state,
        isLoadMoreChartDay: true,
      };
    case FETCH_MORE_CHART_DATA_DAY.ERROR:
      return {
        ...state,
        isLoadMoreChartDay: false,
      };
    case FETCH_MORE_CHART_DATA_DAY.SUCCESS:
      state.chartDataDay.splice((CHART_PAGE_SIZE - state.numberDay - 1) * 14, 14)
      state.chartDataDay.splice((CHART_PAGE_SIZE - state.numberDay - 1) * 14, 0, ...action.payload);

      return {
        ...state,
        numberDay: state.numberDay + 1,
        isLoadMoreChartDay: false,
      };

    case FETCH_MORE_CHART_DATA_MONTH.LOADING:
      return {
        ...state,
        isLoadMoreChartMonth: true,
      };
    case FETCH_MORE_CHART_DATA_MONTH.ERROR:
      return {
        ...state,
        isLoadMoreChartMonth: false,
      };
    case FETCH_MORE_CHART_DATA_MONTH.SUCCESS:
      state.chartDataMonth.splice((CHART_PAGE_SIZE - state.numberMonth - 1) * 14, 14)
      state.chartDataMonth.splice((CHART_PAGE_SIZE - state.numberMonth - 1) * 14, 0, ...action.payload);

      return {
        ...state,
        numberMonth: state.numberMonth + 1,
        isLoadMoreChartMonth: false,
      };
    //year
    case FETCH_MORE_CHART_DATA_YEAR.LOADING:
      return {
        ...state,
        isLoadMoreChartYear: true,
      };
    case FETCH_MORE_CHART_DATA_YEAR.ERROR:
      return {
        ...state,
        isLoadMoreChartYear: false,
      };
    case FETCH_MORE_CHART_DATA_YEAR.SUCCESS:
      // state.chartDataMonth.splice((CHART_PAGE_SIZE - state.numberYear - 1) * 14, 14)
      // state.chartDataMonth.splice((CHART_PAGE_SIZE - state.numberYear - 1) * 14, 0, ...action.payload);

      return {
        ...state,
        numberYear: state.numberYear + 1,
        isLoadMoreChartYear: false,
      };
    case UPDATE_HIGHLIGHT_DAY:
      return {
        ...state,
        highlightDay: action.payload
      }
    case UPDATE_HIGHLIGHT_MONTH:
      return {
        ...state,
        highlightMonth: action.payload
      }
    case UPDATE_HIGHLIGHT_YEAR:
      return {
        ...state,
        highlightYear: action.payload
      }
    default:
      return state;
  }

}