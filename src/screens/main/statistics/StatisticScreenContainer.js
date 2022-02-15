import React, { Component } from "react";
import { View, RefreshControl, ScrollView } from "react-native";
import { connect } from "react-redux";
import Chart from "./Chart";
import Spinner from 'react-native-spinkit';
import Colors from "../../../assets/Colors";

import { TYPE, ACTION_NAME } from "./common"
// import { ScrollView } from "react-native-gesture-handler";
import { fetchChartData, getListTripByTime } from "./StatisticAction"
import styles from "./style"

export class StatisticsScreenContainer extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Báo cáo"
  });

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false
    }
  }

  fetchChartData = () => {
    const type = this.props.type;
    this.props.onFetchChartData({ type_get: type, number: 0, actionName: ACTION_NAME[type] })
    console.log("componentWillReceiveProps chart done")
  }

  fetchFirstElementData = () => {
    this.props.getListTrip({ actionName: typeList, ...timeRange, serial_before: 999999999 })
  }

  onRefresh = () => {
    this.setState({
      refreshing: true
    }, () => this.fetchChartData());
    this.setState({
      refreshing: false
    })
  }

  componentDidMount() {
    this.fetchChartData();

  }

  render() {
    const { type } = this.props;
    var isLoadingChartData = this.props.isLoadingChartDataDay;
    const isLoadingMoreChartObj = {
      day: this.props.isLoadMoreChartDay,
      month: this.props.isLoadMoreChartMonth,
      year: this.props.isLoadMoreChartYear
    }
    var isLoadingMoreChartData = isLoadingMoreChartObj[type]
    if (type === TYPE.MONTH) {
      isLoadingChartData = this.props.isLoadingChartDataMonth
    }
    if (type === TYPE.YEAR) {
      isLoadingChartData = this.props.isLoadingChartDataYear
    }
    return (
      <View>
        <ScrollView style={styles.main}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.onRefresh()} />
          }
        >
          {this.props.content}
        </ScrollView>
        {
          isLoadingChartData ? <View style={styles.spiner}>
            <Spinner type={"Circle"} color={Colors.colorPrimary} size={60} />
          </View> : null
        }
        {

          isLoadingMoreChartData ? <View style={styles.spinerLoadMore}>
            <Spinner type={"Circle"} color={Colors.colorPrimary} size={60} />
          </View> : null

        }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoadingChartDataDay: state.statisticReducer.isLoadingChartDataDay,
    isLoadingChartDataMonth: state.statisticReducer.isLoadingChartDataMonth,
    isLoadingChartDataYear: state.statisticReducer.isLoadingChartDataYear,
    chartData: state.statisticReducer.chartDataDay,
    currentDataPoint: state.statisticReducer.currentDataPointDay,
    listTrip: state.statisticReducer.listTripByDay,
    isLoadMoreChartDay: state.statisticReducer.isLoadMoreChartDay,
    isLoadMoreChartMonth: state.statisticReducer.isLoadMoreChartMonth,
    isLoadMoreChartYear: state.statisticReducer.isLoadMoreChartYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchChartData: (data) => {
      dispatch(fetchChartData(data))
    },
    getListTrip: (data) => {
      dispatch(getListTripByTime(data))
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StatisticsScreenContainer);
