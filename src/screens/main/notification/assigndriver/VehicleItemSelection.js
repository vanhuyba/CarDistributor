import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { normalize } from "../../../../utils/ViewUtils";
import { formatVND } from "../../../../utils/Utils";
import Ripple from 'react-native-material-ripple';
import ItemNotificationDetail from "../../../../components/ItemNotifyDetail";
import Colors from "../../../../assets/Colors";


class VehicleItemSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    let { vehicle, selected } = this.props;
    let outlineStyle = styles.outlineRadioDisabled;
    let fillStyle = styles.fillRadioDisabled;
    let borderItem = styles.container;
    if(selected){
      outlineStyle = {...outlineStyle, ...styles.outlineRadioSelected}
      fillStyle = {...fillStyle, ...styles.fillRadioSelected}
      borderItem = {...borderItem, ...styles.selected}
    }
    return (
      <Ripple style={borderItem}
        onPress={() => this.props.onClick()}
      >
        <View style={styles.wrapContent}>
          <Text style={styles.name}>{vehicle.detail}</Text>
          <Text style={styles.phone}>{vehicle.license}</Text>
        </View>
        <View style={styles.radioBtn}>
          <View style={outlineStyle}>
            <View style={fillStyle}></View>
          </View>
        </View>
      </Ripple>
    )
  }

}

const styles = StyleSheet.create({
  radioBtn: {
    width: "auto",
    height: "auto",
    marginRight: normalize(8)
  },

  fillRadioSelected: {
    backgroundColor: Colors.colorPrimary
  },
  outlineRadioSelected: {
    borderColor: Colors.colorPrimary
  },

  fillRadioDisabled: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.colorLightGrey
  },
  outlineRadioDisabled: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.colorWhite,
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: Colors.colorLightGrey
  },
  selected: {
    borderColor: Colors.colorPrimary,
    borderWidth: 1.5,
  },
  container: {
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: "auto",
    paddingTop: 8,
    paddingBottom: 8,
    borderColor: Colors.colorLightGrey,
    borderWidth: 0.5,
    borderRadius: 8,
    marginTop: normalize(8),
  },
  wrapContent: {
    flex: 1,
    marginLeft: normalize(8)
  },
  name: {
    fontWeight: "700",
    fontSize: 14,
    color: "#00B1FF",
  },
  phone: {
    fontSize: 12,
    color: "#000000",
  },
})

VehicleItemSelection.defaultProps = {
  selected: false
}

export default VehicleItemSelection