import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { TYPE_SCREEN } from "../../../../data/Constants";
import { normalize } from "../../../../utils/ViewUtils"
import { Colors } from "react-native/Libraries/NewAppScreen";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class DriverItem extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const { driver } = this.props
    return (
      <View style={styles.container}>
        <View style={styles.wrapAvatar}>
          <Image
            resizeMode="center"
            style={styles.image}
            source={require('../../../../assets/icons/ic_account.png')}
          />
        </View>
        <View style={styles.wrapContent}>
          <Text style={styles.name}>{driver.name}</Text>
          <Text style={styles.phone}>{driver.phoneNumber}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("AddDriverScreen", {
              driver: driver,
              type: TYPE_SCREEN.UPDATE
            })
          }}>
          <Image
            style={styles.iconEdit}
            source={require('../../../../assets/icons/ic_edit_profile.png')}
          />
        </TouchableOpacity>
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
    width: 20,
    height: 20
  },
  wrapAvatar: {
    width: 40,
    height: 40,
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: "#FF7900",
    justifyContent: "center"
  }
});


export default DriverItem;