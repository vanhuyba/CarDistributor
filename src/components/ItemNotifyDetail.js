import React, { PureComponent } from "react";
import { StyleSheet, Text, View } from "react-native";
import { normalize } from "../utils/ViewUtils";
import Colors from "../assets/Colors";

export default class ItemNotificationDetail extends PureComponent {
  render() {
    const { title, detail, detailStyle, border, labelStyle } = this.props;

    return (
      <View style={border ? styles.container : { ...styles.container, borderBottomWidth: 0 }}>
        <Text style={StyleSheet.flatten([styles.title, labelStyle])}> {title} </Text>
        <Text style={StyleSheet.flatten([
          styles.detail,
          detailStyle
        ])}>
          {detail}
        </Text>
      </View>
    );
  }
}

ItemNotificationDetail.defaultProps = {
  border: true
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(14),
    borderBottomColor: Colors.colorLightGrey,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  title: {
    flex: 9,
    fontSize: normalize(10),
    fontWeight: "600",
    color: "black"
  },
  detail: {
    flex: 10,
    fontSize: normalize(10),
    textAlign: "right",
    color: "black"
  }
});

