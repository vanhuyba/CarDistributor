import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import Chart from "./Chart";
import StatisticScreenContainer from "./StatisticScreenContainer"
import ListTrip from "./ListTrip";
import SummaryData from "./SummaryData";
import { GET_LIST_TRIP_DAY, getListTripByTime, updateDataPoint } from "./StatisticAction"
import styles from "./style"
import { TYPE, parseTimerange, TYPE_RESET_LIST_TRIP, CLICK_ELEMENT_CHART_TYPE, TYPE_GET_LIST_TRIP } from "./common";
export class StatisticsScreenDay extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Báo cáo",
    swipeEnabled: false
  });

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps, prevState) {
    
  }

  getListTripByElementClick = (indexXAxis) => {
    const data = this.props.chartData;
    const xAxis = data.map((e, key) => {
      return e.time.toString()
    });

    this.props.onSelect({ actionName: CLICK_ELEMENT_CHART_TYPE[TYPE.DAY], ...data[indexXAxis] })
    this.props.resetListTrip(TYPE_RESET_LIST_TRIP[TYPE.DAY])
    let timeRange = parseTimerange(TYPE.DAY, this.props.currentDataPoint.time);
    this.props.getListTripFirst({ actionName: TYPE_GET_LIST_TRIP[TYPE.DAY], ...timeRange, serial_before: 999999999 })
  }

  render() {
    const data = this.props.chartData;
    const dataPoint = this.props.currentDataPoint;
    const listTrip = this.props.listTrip;
    return (
      <StatisticScreenContainer
        type={TYPE.DAY}
        content={
          <View>
            <View style={styles.wrapChart}>
              <Chart
                data={data}
                type={TYPE.DAY}
              />
            </View>

            {
              //this.props.listTrip.length === 0 ? null :
              <View>
                <SummaryData data={dataPoint} />
                <View style={styles.wrapList}>
                  <ListTrip
                    navigation={this.props.navigation}
                    data={listTrip}
                    type={TYPE.DAY}
                  // typeList={GET_LIST_TRIP_DAY.actionName}
                  />
                </View>
              </View>
            }
          </View>

        }
      />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chartData: state.statisticReducer.chartDataDay,
    currentDataPoint: state.statisticReducer.currentDataPointDay,
    listTrip: state.statisticReducer.listTripByDay,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListTripFirst: (data) => {
      dispatch(getListTripByTime(data))
    },
    resetListTrip: (type) => {
      dispatch({ type: type })
    },
    onSelect: (data) => {
      dispatch(updateDataPoint(data))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsScreenDay);
