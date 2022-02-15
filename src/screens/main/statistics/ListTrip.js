import React, { Component } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import { getListTripByTime } from "./StatisticAction"
import ItemNotification from "../../../components/ItemNotitication"
import { parseTimerange, getKey, TYPE_GET_LIST_TRIP } from "./common"
import Constants from "../../../data/Constants"
import Strings from "../../../utils/LocalizationHelper";
import { normalize } from "../../../utils/ViewUtils"
import { formatVND } from "../../../utils/Utils"
export class ListTrip extends Component {
  constructor(props) {
    super(props)
  }

  handleShowMore = () => {
    console.log("handleShowMore");
    const { type } = this.props;

    const serialObj = {
      day: this.props.serialDay,
      month: this.props.serialMonth,
      year: this.props.serialYear
    }

    const timeObj = {
      day: this.props.currentDataPointDay.time,
      month: this.props.currentDataPointMonth.time,
      year: this.props.currentDataPointYear.time,
    }

    var serial = serialObj[type];
    var time = timeObj[type]
    var timeRange = parseTimerange(type, time);

    console.log("serial_before", { actionName: type, ...timeRange, serial_before: serial })
    this.props.getListTrip({ actionName: TYPE_GET_LIST_TRIP[type], ...timeRange, serial_before: serial })
  }

  render() {
    const { data, type } = this.props;
    const length = data.length;
    const totalTripObj = {
      day: this.props.currentDataPointDay.number_trip,
      month: this.props.currentDataPointMonth.number_trip,
      year: this.props.currentDataPointYear.number_trip,
    }

    const totalTrip = totalTripObj[type];
    return (
      <View style={styles.main}>
        {
          data.map((item, key) => {
            return (
              <ItemNotification
                navigation={this.props.navigation}
                price={formatVND(item.price_supplier)}
                data={item}
                type={Constants.COMPLETED}

              />
            )
          })
        }
        {
          length < totalTrip ? (
            !this.props.isLoadingDataStatistic ? (
              <TouchableOpacity
                style={styles.showMore}
                onPress={() => this.handleShowMore()}
              >
                <Text style={styles.text}>{Strings("statistic.showmore")}</Text>
              </TouchableOpacity>
            ) : <View style={styles.blank}></View>
          ) : null
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: "auto",
    // backgroundColor: "#FF0000"
    // paddingHorizontal: normalize(8)
  },
  showMore: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: normalize(12),
    fontStyle: "italic",
    color: "blue",
  },
  blank: {
    height: 40
  }
})

const mapStateToProps = (state) => {
  return {
    isLoadingDataStatistic: state.statisticReducer.isLoadingDataStatistic,

    serialDay: state.statisticReducer.serialDay,
    serialMonth: state.statisticReducer.serialMonth,
    serialYear: state.statisticReducer.serialYear,

    currentDataPointDay: state.statisticReducer.currentDataPointDay,
    currentDataPointMonth: state.statisticReducer.currentDataPointMonth,
    currentDataPointYear: state.statisticReducer.currentDataPointYear,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getListTrip: (data) => {
      dispatch(getListTripByTime(data))
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListTrip);
