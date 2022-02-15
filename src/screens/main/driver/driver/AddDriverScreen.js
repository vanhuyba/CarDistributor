import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput } from "react-native";
import Toast from "react-native-simple-toast";
import Strings from "../../../../utils/LocalizationHelper";
import { ApiHelper } from "../../../../data/remote/ApiHelper";
import AppOverlay from "../../../../components/AppOverlay";
import Constants, { TYPE_SCREEN } from "../../../../data/Constants";
import { connect } from "react-redux";
import { requestAddDriver, ADD_DRIVER, requestUpdateDriver, requestDeleteDriver, fetchDriver } from "../DriverAction";
import {normalize} from "../../../../utils/ViewUtils"
import Ripple from 'react-native-material-ripple';

const deviceWidth = Dimensions.get('window').width;


class AddDriver extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      name: "",
      phoneNumber: ""
    }

    if (this.props.navigation.state.params.type === "edit") {
      const { driver } = this.props.navigation.state.params;
      this.state = {
        driverId: driver.id,
        isLoading: false,
        name: driver.name,
        phoneNumber: driver.phoneNumber,
      }
    } else {
      this.state = {
        isLoading: false,
        name: "",
        phoneNumber: ""
      }
    }
  }

  static navigationOptions = ({ navigation }) => {
    const screenType = navigation.state.params.type
    if (screenType === TYPE_SCREEN.ADD) {
      return {
        title: Strings("header.add_driver"),
        headerRight: (<View />)
      };
    } else {
      return {
        title: Strings("header.edit_driver"),
        headerRight: (
          <TouchableOpacity style={styles.headerRight}
            onPress={() => {
              navigation.state.params.removeDriver();
            }}>
            <Image style={styles.iconDelete} source={require("../../../../assets/icons/ic_delete_2.png")} />
          </TouchableOpacity>
        )
      };
    }
  };

  isEditable = () => {
    return (this.props.navigation.state.params.type === TYPE_SCREEN.ADD);
  }

  removeDriver = () => {
    // Toast.show(this.state.driverId + "", Toast.SHORT);
    let { driverId } = this.state;
    this.props.onDeleteDriver({ driverId })
  }

  componentDidMount() {
    this.props.navigation.setParams({ removeDriver: this.removeDriver });
  }
  // "name_null": "Please enter name",
  // "phone_invalid": "Phone number is invalid",
  // "bks_null": "Please enter the license plate",
  // "vehicle_name_bull": "Please enter name"
  addDriver = () => {
    const { name, phoneNumber } = this.state
    if (name === "") {
      Toast.show(Strings("message.name_null"), Toast.SHORT);
    } else if (phoneNumber.length < 8) {
      Toast.show(Strings("message.phone_invalid"), Toast.SHORT);
    } else {
      this.props.onAddDriver({ name, phoneNumber })
    }
  }

  editDriver = () => {
    let { driverId, name } = this.state;
    this.props.onUpdateDriver({ driverId, name })
  }

  onChange = (e, name) => {
    this.setState({
      [name]: e.nativeEvent.text
    })
  }

  render() {
    const screenType = this.props.navigation.state.params.type;
    const { isLoadingAddDriver, isUpdatingDriver, isLoadingDeleteDriver } = this.props;
    const isLoading = isLoadingAddDriver || isUpdatingDriver || isLoadingDeleteDriver;
    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.label}>
            <Image
              style={styles.icon}
              source={require("../../../../assets/icons/icon_add_user.png")}
            />
            <Text style={styles.labelText}>{Strings("driver.name")}</Text>
            <Text style={styles.required}> *</Text>
          </View>

          <TextInput onChange={(e) => this.onChange(e, "name")} style={styles.input} placeholderTextColor="#d6d6d6" placeholder={Strings("driver.name")} value={this.state.name}></TextInput>
        </View>
        {
          // add screen, show
          this.isEditable() ?
            <View style={styles.item}>
              <View style={styles.label}>
                <Image
                  style={styles.icon}
                  source={require("../../../../assets/icons/icon_add_phone.png")}
                />
                <Text style={styles.labelText}>{Strings("driver.phone")}</Text>
                <Text style={styles.required}> *</Text>
              </View>

              <TextInput onChange={(e) => this.onChange(e, "phoneNumber")} style={styles.input}  placeholderTextColor="#d6d6d6"  placeholder={Strings("driver.phone")} keyboardType="numeric" value={this.state.phoneNumber} ></TextInput>
            </View>
            :
            null
        }
        <View style={[styles.footer, { display: screenType === TYPE_SCREEN.ADD ? "flex" : "none" }]}>
          <Ripple style={styles.btnAdd} onPress={() => this.addDriver()}>
            <Text style={styles.addNew}>{Strings("driver.add")}</Text>
          </Ripple>
        </View>
        <View style={[styles.footer, { display: screenType === "edit" ? "flex" : "none" }]}>
          <Ripple style={styles.btnAdd} onPress={() => this.editDriver()}>
            <Text style={styles.addNew}>{Strings("driver.update")}</Text>
          </Ripple>
        </View>
        <AppOverlay
          loadingIcon="ThreeBounce"
          isVisible={isLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "100%",
    height: "auto",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    marginLeft: normalize(20),
    marginTop: normalize(0),
    color: "#000000",
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
    paddingBottom: 2

  },
  item: {
    marginTop: normalize(16),
    height: "auto",
    width: "100%"
  },
  label: {
    flexDirection: "row",
    width: "100%",
    height: "auto"

  },
  labelText: {
    marginLeft: normalize(8)
  },
  icon: {
    width: 20,
    height: 20,
  },
  required: {
    color: "#FF0000"
  },
  addNew: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700"
  },
  footer: {
    marginTop: normalize(20),
    height: "auto",
    width: "100%",
    alignItems: "center"
  },
  btnAdd: {
    marginBottom: normalize(20),
    justifyContent: "center",
    alignItems: "center",
    width: deviceWidth - 32,
    height: 40,
    backgroundColor: "#FF7900",
    borderRadius: 20
  },
  headerRight: {
    paddingHorizontal: 16
  },
  iconDelete: {
    width: 20,
    height: 20,
  }

});

const mapStateToProps = (state) => {
  return {
    isLoadingAddDriver: state.driverReducer.isLoadingAddDriver,
    isUpdatingDriver: state.driverReducer.isUpdatingDriver,
    isLoadingDeleteDriver: state.driverReducer.isLoadingDeleteDriver,

    isLoading: state.driverReducer.isLoadingCommon,
    commonMessage: state.driverReducer.commonMessage,
    dataSource: state.driverReducer.driverList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchData: () => {
      dispatch(fetchDriver())
    },
    onAddDriver: (data) => {
      dispatch(requestAddDriver(data))
    },
    onUpdateDriver: (data) => {
      dispatch(requestUpdateDriver(data))
    },
    onDeleteDriver: (data) => {
      dispatch(requestDeleteDriver(data))
    },
    resetCommonMessage: () => dispatch({ type: Constants.RESET_COMMON_MESSAGE }),
    removeItemDriver: (data) => dispatch({ type: Constants.REMOVE_DRIVER_LOCAL, payload: data }), //common for delete or update item

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddDriver);