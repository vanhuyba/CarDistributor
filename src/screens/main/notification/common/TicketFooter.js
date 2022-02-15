import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text } from "react-native";

import { Button } from "react-native-elements";

import Strings from "../../../../utils/LocalizationHelper";
import Constants, { TRIP_STATUS } from "../../../../data/Constants";
import { normalize } from "../../../../utils/ViewUtils";
import Colors from "../../../../assets/Colors";

import {
  getTextButtonNotificationDetail,
  screenshots
} from "../../../../utils/Utils";

class TicketFooter extends React.Component {
  constructor(props) {
    super(props);
  }
  
  isCompletable = (data) => {
    var check = ((data.status === TRIP_STATUS.ACCEPT && Boolean(data.vehicle_id)) || (data.status === TRIP_STATUS.UPDATE && Boolean(data.vehicle_id)) || data.status === TRIP_STATUS.RIDING)
    return check;
  }
  
  render() {
    let { data, type } = this.props;
    return (
      <View
        style={styles.wraperFooter}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row"
          }}
        >
          <TouchableOpacity
            onPress={() => {
              screenshots(this.props.screenShot());
            }}>
            <View style={{ alignItems: "center" }}>
              <Image source={require("icons/ic_camera.png")} />
              <Text style={styles.buttonAdditionText}>
                {Strings("notification.screen_shot")}
              </Text>
            </View>

          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.copy();
            }}>
            <View style={{ alignItems: "center", marginStart: normalize(16) }}>
              <Image source={require("icons/ic_copy.png")} />
              <Text style={styles.buttonAdditionText}>
                {Strings("notification.copy")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Button
          onPress={() => this.props.assignDriver()}
          title={getTextButtonNotificationDetail(type, data.status, data.trip_type, Boolean(data.vehicle_id))}
          buttonStyle={type === Constants.COMPLETED ? styles.buttonCompletedStyle : styles.buttonStyle}
          titleStyle={type === Constants.COMPLETED ? styles.buttonCompletedText : styles.buttonText}
          disabled={type === Constants.COMPLETED || data.status === TRIP_STATUS.RIDING}
          disabledStyle={styles.buttonCompletedStyle}
          disabledTitleStyle={styles.buttonCompletedText}
        />

        {
          this.isCompletable(data) ?
            <Button
              onPress={() => this.props.requestCompleteBooking()}
              title={Strings("notification.btn_complete")}
              buttonStyle={styles.buttonStyleComplete}
              titleStyle={styles.buttonText}
            /> :
            null
        }

      </View>
    )
  }

}

const styles = StyleSheet.create({
  wraperFooter: {
    flexDirection: "row",
    width: "100%",
    borderBottomColor: "#35000000",
    borderTopWidth: 0.5,
    alignItems: "center",
    paddingHorizontal: normalize(14),
    paddingVertical: normalize(10)
  },
  buttonAdditionText: {
    textAlign: "center",
    fontSize: normalize(8),
    color: "#00B1FF",
    marginTop: normalize(5),
    fontWeight: "500"
  },
  buttonStyle: {
    backgroundColor: Colors.colorPrimary,
    borderRadius: normalize(50),
    width: normalize(80),
    height: normalize(34)
  },
  buttonStyleComplete: {
    marginLeft: normalize(8),
    backgroundColor: Colors.colorPrimary,
    borderRadius: normalize(50),
    width: normalize(80),
    height: normalize(34)
  },
  buttonCompletedStyle: {
    backgroundColor: "#FFFFFF00",
    borderRadius: normalize(50),
    height: normalize(34)
  },
  buttonText: { color: Colors.colorWhite, fontWeight: "400", fontSize: normalize(10) },
  buttonCompletedText: { color: "#70cf00", fontWeight: "400", fontSize: normalize(10) },

  buttonAcceptBooking: {
    backgroundColor: Colors.colorPrimary,
    borderRadius: normalize(18),
    height: normalize(26),
    padding: 0,
    width: "100%"
  },

})

export default TicketFooter