import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { TYPE_SCREEN } from "../../../../data/Constants";
import {normalize} from "../../../../utils/ViewUtils"

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const icons = {
  hatchback: require("../../../../assets/icons/ic_hatchback.png"),
  sedan: require("../../../../assets/icons/ic_sedan.png"),
  suv: require("../../../../assets/icons/ic_suv.png"),
  minivan: require("../../../../assets/icons/ic_minivan.png")
}

class VehicleItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { vehicle } = this.props
    return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={icons[vehicle.type]}
        />
        <View style={styles.wrapContent}>
          <Text style={styles.name}>{vehicle.detail}</Text>
          <Text style={styles.phone}>{vehicle.license}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("AddVehicleScreen", {
              vehicle: vehicle,
              type: TYPE_SCREEN.UPDATE
            })
          }}>
          <Image

            style={styles.iconEdit}
            source={require('../../../../assets/icons/ic_edit_profile.png')}
          /></TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
    height: "auto",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 0.5
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
  iconEdit: {
    resizeMode: "center",
    padding: 8,
    marginLeft: normalize(4),
    width: 40,
    padding: 8,
    height: 40,
  },
  wrapContent: {
    flex: 1,
    marginLeft: normalize(16)
  },
  image: {
    resizeMode: "contain",
    width: 40,
    height: 40,
  }
});


export default VehicleItem;