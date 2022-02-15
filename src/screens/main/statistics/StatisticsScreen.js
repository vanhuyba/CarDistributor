import React, { Component } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { normalize } from "../../../utils/ViewUtils";
import Colors from "../../../assets/Colors";

export class StatisticsScreen extends Component {
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{
            fontSize: normalize(18),
            fontWeight: '700',
            color: Colors.colorPrimary,
            marginTop: normalize(10)
          }}> Báo cáo </Text>
        </View>

      </SafeAreaView>
    );
  }
}

export default StatisticsScreen;
