import React, { Component } from "react";
import { Text, View, StyleSheet, Dimensions, processColor } from "react-native";
import Spinner from 'react-native-spinkit';
import Colors from "../../../assets/Colors";
import { BarChart } from 'react-native-charts-wrapper';
import { connect } from "react-redux";
import { updateDataPoint, UPDATE_DATA_POINT_DAY, UPDATE_DATA_POINT_MONTH, UPDATE_DATA_POINT_YEAR, getListTripByTime, fetchMoreChartData, RESET_SERIAL_DAY, RESET_SERIAL_MONTH, RESET_SERIAL_YEAR, updateHighligh } from "./StatisticAction";
import { parseTimerange, getKey, TYPE, ACTION_NAME_FETCH_MORE, CLICK_ELEMENT_CHART_TYPE, TYPE_GET_LIST_TRIP, TYPE_UPDATE_HIGHLIGHT, TYPE_RESET_LIST_TRIP, UPDATE_DATA_POINT_TYPE } from "./common"
import { CHART_PAGE_SIZE } from "../../../data/Constants"
import {normalize} from "../../../utils/ViewUtils"

const legend = {
  enabled: false
};

export class Chart extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Báo cáo"
  });

  constructor(props) {
    super(props);
    this.type = this.props.type;
    this.TWO_MINUTES = new Date().getTime();
    const IS_LOADING_MORE_CHART_DATA = {
      day: this.props.isLoadMoreChartDay,
      month: this.props.isLoadMoreChartMonth,
      year: this.props.isLoadMoreChartYear
    }
    this.isLoadingMoreChartData = IS_LOADING_MORE_CHART_DATA[this.type]
  }

  componentDidMount() {

  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate", prevProps)
  }

  handleSelect(event) {
    const { data } = this.props;
    const xAxis = data.map((e, key) => {
      return e.time.toString()
    });

    let entry = event.nativeEvent
    let x = entry.x;
    if (entry == null) {
      console.log("Click null");
    } else {
      console.log("Click element x: ", x);
      if (x !== undefined) {
        // reset empty listTrip and reload
        this.props.onUpdateDataPoint({ actionName: UPDATE_DATA_POINT_TYPE[this.type], ...data[x] })
        this.props.onUpdateHighlight({ actionName: TYPE_UPDATE_HIGHLIGHT[this.type], value: x })
        this.props.resetListTrip(TYPE_RESET_LIST_TRIP[this.type])
        let timeRange = parseTimerange(this.type, xAxis[x]);
        this.props.getListTrip({ actionName: TYPE_GET_LIST_TRIP[this.type], ...timeRange, serial_before: 999999999 })
      }
    }
  }

  getListTripByElementClick = (indexXAxis) => {
    const { data } = this.props;
    const xAxis = data.map((e, key) => {
      return e.time.toString()
    });

    this.props.resetListTrip(TYPE_RESET_LIST_TRIP[this.type])
    let timeRange = parseTimerange("day", "11/23/2019");
    console.log("getListTripByElementClick", timeRange, xAxis[indexXAxis])
    this.props.getListTrip({ actionName: "day", ...timeRange, serial_before: 999999999 })

  }

  mockLoadDataFromServer() {
    console.log("mockLoadDataFromServer::::::::: loading new data")
    const checkTime = new Date().getTime();
    if (checkTime > this.TWO_MINUTES) {
      var number;
      if (this.type === TYPE.DAY) {
        number = this.props.numberDay;
      } else if (this.type === TYPE.MONTH) {
        number = this.props.numberMonth;
      } else {
        number = this.props.numberYear;
      }
      //this.refs.chart.moveViewToAnimated(14, 0, "left", 2000);
      this.props.onFetchMoreDataChart({ type_get: this.type, number: number, actionName: ACTION_NAME_FETCH_MORE[this.type] })
      this.TWO_MINUTES = new Date().getTime() + 3000;
    } else {
      console.log("mockLoadDataFromServer::::::::: invalid time")
    }

  }

  handleChange(event) {
    if (this.type === TYPE.YEAR) return;
    let nativeEvent = event.nativeEvent
    console.log("handleChange", nativeEvent)
    let _this = this;
    const pageIndexObj = {
      day: this.props.numberDay,
      month: this.props.numberMonth,
      year: this.props.numberYear
    }

    const pageIndex = pageIndexObj[this.type]

    if (nativeEvent.action == 'chartTranslated') {
      let { left, right, centerX } = nativeEvent
      if (left < (CHART_PAGE_SIZE - pageIndex) * 14) {
        if (!this.isLoadingMoreChartData) {
          _this.mockLoadDataFromServer();
          return;
        }
      }
    }
  }

  render() {
    const { data } = this.props;


    var xAxis;
    xAxis = data.map((e, key) => {
      var x = e.time.toString()
      if (this.type === TYPE.DAY && x !== "") {
        var arr = x.split('/');
        x = `${arr[1]}/${arr[0]}/${arr[2]}`
      }
      return x;
    });
    var yAxis;
    yAxis = data.map((e, key) => {
      return e.price
    })

    var highlight = this.props.highlightDay;
    if (this.type === TYPE.MONTH) {
      highlight = this.props.highlightMonth;
    }
    if (this.type === TYPE.YEAR) {
      highlight = this.props.highlightYear;
    }

    return (
      <View style={styles.main}>
        {
          <BarChart
            ref="chart"
            chartDescription={{ text: '' }}
            scaleEnabled={false}
            style={styles.chart}
            data={{
              dataSets: [{
                values: yAxis,
                label: null,
                config: {
                  color: processColor('#EFEBE9'),
                  highlightAlpha: 100,
                  highlightColor: processColor('#FFD600'),
                }
              }],
              config: {
                barWidth: 0.5,
              }
            }}
            xAxis={{
              valueFormatter: xAxis,
              granularityEnabled: true,
              drawGridLines: false,
              granularity: 1,
              position: "BOTTOM"
            }}
            animation={{ durationX: 1000 }}
            legend={legend}
            gridBackgroundColor={processColor('#FF7900')}
            visibleRange={{ x: { min: 4, max: 4 } }}
            drawBarShadow={false}
            drawHighlightArrow={true}
            onSelect={this.handleSelect.bind(this)}
            onChange={this.handleChange.bind(this)}
            highlights={[{ x: highlight }]}
            // zoom={{scaleX: 5, scaleY: 1, xValue:  20, yValue: 0, axisDependency: 'LEFT'}}
            zoom={this.props.zoomChart}
            yAxis={{ right: { enabled: false }, left: { textColor: processColor('#73859D'), gridColor: processColor('#314051') } }}

          />
        }

      </View>
    );
  }
}
const styles = StyleSheet.create({

  loading: {
    opacity: 0.2,
    backgroundColor: "#d6d6d6",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  main: {
    marginTop: normalize(16),
    width: "100%",
    height: 200,
  },
  chart: {
    width: "100%",
    height: "100%"
  }
})

const mapStateToProps = (state) => {
  return {
    serialDay: state.statisticReducer.serialDay,
    serialMonth: state.statisticReducer.serialMonth,
    serialYear: state.statisticReducer.serialYear,
    numberDay: state.statisticReducer.numberDay,
    numberMonth: state.statisticReducer.numberMonth,
    numberYear: state.statisticReducer.numberYear,
    chartDataDayLength: state.statisticReducer.chartDataDay.length,
    chartDataMonthLength: state.statisticReducer.chartDataMonth.length,
    chartDataYearLength: state.statisticReducer.chartDataYear.length,

    highlightDay: state.statisticReducer.highlightDay,
    highlightMonth: state.statisticReducer.highlightMonth,
    highlightYear: state.statisticReducer.highlightYear,
    zoomChart: state.statisticReducer.zoomChart
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListTrip: (data) => {
      dispatch(getListTripByTime(data))
    },
    resetListTrip: (type) => {
      dispatch({ type: type })
    },
    onFetchMoreDataChart: (data) => {
      dispatch(fetchMoreChartData(data))
    },
    onUpdateDataPoint: (data) => {
      dispatch(updateDataPoint(data))
    },
    onUpdateHighlight: (data) => {
      dispatch(updateHighligh(data))
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Chart);
