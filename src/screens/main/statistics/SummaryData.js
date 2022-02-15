import React, { Component } from "react";
import { Text, View, StyleSheet, PropTypes } from "react-native";
import { vndStyle } from "../../../utils/Utils";
import Colors from "../../../assets/Colors";
import Strings from "../../../utils/LocalizationHelper";
import {normalize} from "../../../utils/ViewUtils"

export default class SummaryData extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Báo cáo"
  });

  render() {
    const data = this.props.data;
    var time = data.time;
    if (time !== undefined) {
      if (time.length === 10) {
        // mm/dd/yyyy
        var timeArr = time.split('/')
        time = `${timeArr[1]}/${timeArr[0]}/${timeArr[2]}`
      }
    }

    return (
      <View style={styles.container}>
        <Text style={styles.detail}>{Strings("statistic.detail")} {time}</Text>
        <View style={styles.main}>
          <View style={styles.wrapPrice}>
            <Text style={styles.label}>{Strings("statistic.total_revenue")} </Text>
            <View style={styles.bottom}>
              <Text>
                <Text style={styles.value}>{vndStyle(data.price)}</Text>
                <Text style={styles.unit}> {Strings("statistic.vnd")}</Text>
              </Text>
            </View>
          </View>
          <View style={styles.blank}></View>
          <View style={styles.wrapTrip}>
            <Text style={styles.label}>{Strings("statistic.total_no")} </Text>
            <View style={styles.bottom}>
              <Text>
                <Text style={styles.value}> {vndStyle(data.number_trip)}</Text>
                <Text style={styles.unit}> {Strings("statistic.trip")}</Text>
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: normalize(8),
  },
  detail: {
    marginBottom: normalize(8)
  },
  main: {
    width: '100%',
    height: 80,
    flexDirection: 'row'
  },
  wrapPrice: {
    borderRadius: 10,
    paddingVertical: normalize(8),
    paddingHorizontal: normalize(16),
    backgroundColor: "rgb(56, 176, 213)",
    flex: 1,
    height: '100%',

  },
  blank: {
    width: 20,
  },
  wrapTrip: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgb(137, 189, 78)",
    flex: 1,
    height: '100%',
  },
  bottom: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end"
  },
  label: {
    color: "#FFFFFF",
    fontSize: normalize(12)
  },
  value: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: normalize(14)
  },
  unit: {
    color: "#FFFFFF",
    fontSize: normalize(10)
  }
})

SummaryData.defaultProps = {
  data: {
    price: 0,
    number_trip: 0
  }
};

