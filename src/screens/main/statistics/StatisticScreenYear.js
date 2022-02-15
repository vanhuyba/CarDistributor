import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import { connect } from "react-redux";
import Chart from "./Chart";
import { TYPE, parseTimerange } from "./common"
import ListTrip from "./ListTrip";
import StatisticScreenContainer from "./StatisticScreenContainer"
import SummaryData from "./SummaryData";
import {  getListTripByTime, GET_LIST_TRIP_YEAR } from "./StatisticAction"
import styles from "./style"
export class StatisticScreenYear extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Báo cáo",
    swipeEnabled: false

  });

  componentDidMount() {
    // var currentDate = new Date();
    // var day = currentDate.getDate();
    // var month = currentDate.getMonth() + 1;
    // var year = currentDate.getFullYear();
    // var timeRange = parseTimerange(TYPE.YEAR, `${year}`);
    //this.props.getListTripFirst({ actionName: GET_LIST_TRIP_YEAR.actionName, ...timeRange, serial_before: 999999999 })
  }

  render() {
    const data = this.props.chartData;
    const dataPoint = this.props.currentDataPoint;
    const listTrip = this.props.listTrip;

    return (
      <StatisticScreenContainer
        type={TYPE.YEAR}
        content={
          <View>
            <View style={styles.wrapChart}>
              <Chart data={data}
                type={TYPE.YEAR} />
            </View>
            {
              dataPoint.time === "" ? null :
                <View>
                  <SummaryData
                    data={dataPoint}
                  />
                  <View style={styles.wrapList}>
                    <ListTrip
                      data={listTrip}
                      // typeList={GET_LIST_TRIP_YEAR.actionName}
                      type={TYPE.YEAR}
                      navigation={this.props.navigation} />
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
    isLoadingDataStatistic: state.statisticReducer.isLoadingDataStatistic,
    chartData: state.statisticReducer.chartDataYear,
    currentDataPoint: state.statisticReducer.currentDataPointYear,
    listTrip: state.statisticReducer.listTripByYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListTripFirst: (data) => {
      dispatch(getListTripByTime(data))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatisticScreenYear);
