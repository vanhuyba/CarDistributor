import React, { Component } from "react";
import { View } from "react-native";
import { connect } from "react-redux";
import Chart from "./Chart";
import { TYPE, parseTimerange } from "./common"
import ListTrip from "./ListTrip";
import StatisticScreenContainer from "./StatisticScreenContainer"
import SummaryData from "./SummaryData";
import { getListTripByTime, GET_LIST_TRIP_MONTH } from "./StatisticAction"
import styles from "./style"
export class StatisticScreenMonth extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Báo cáo",
    swipeEnabled: false

  });

  componentDidMount() {
    // var currentDate = new Date();
    // var day = currentDate.getDate();
    // var month = currentDate.getMonth() + 1;
    // var year = currentDate.getFullYear();
    // var timeRange = parseTimerange(TYPE.MONTH, `${month}/${year}`);
    //this.props.getListTripFirst({ actionName: GET_LIST_TRIP_MONTH.actionName, ...timeRange, serial_before: 999999999 })
  }

  render() {
    const data = this.props.chartData;
    const dataPoint = this.props.currentDataPoint;
    const listTrip = this.props.listTrip;

    return (
      <StatisticScreenContainer
        type={TYPE.MONTH}
        content={
          <View>

            <View style={styles.wrapChart}>
              <Chart data={data}
                type={TYPE.MONTH} />
            </View>
            {
              dataPoint.time === "" ? null :
                <View>
                  <SummaryData
                    data={dataPoint} />
                  <View style={styles.wrapList}>
                    <ListTrip
                      data={listTrip}
                      // typeList={GET_LIST_TRIP_MONTH.actionName}
                      type={TYPE.MONTH}
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
    chartData: state.statisticReducer.chartDataMonth,
    currentDataPoint: state.statisticReducer.currentDataPointMonth,
    listTrip: state.statisticReducer.listTripByMonth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListTripFirst: (data) => {
      dispatch(getListTripByTime(data))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatisticScreenMonth);
