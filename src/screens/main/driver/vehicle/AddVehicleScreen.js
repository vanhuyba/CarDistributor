import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Picker, ActionSheetIOS } from "react-native";
import Toast from "react-native-simple-toast";
import Strings from "../../../../utils/LocalizationHelper";
import { ApiHelper } from "../../../../data/remote/ApiHelper";
import AppOverlay from "../../../../components/AppOverlay";
import Constants from "../../../../data/Constants";
import { connect } from "react-redux";
import { requestAddVehicle, requestDeleteVehicle, requestUpdateVehicle, fetchVehicle } from "../DriverAction";
import Ripple from 'react-native-material-ripple';
import { normalize } from "../../../../utils/ViewUtils";
import UpdePicker from "../../../../components/Picker/UpdePicker";
const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

var VEHICLE_TYPE = [
  'hatchback',
  'sedan',
  'suv',
  'minivan',
  "CANCEL"
];

class AddVehicleScreen extends Component {
  constructor(props) {
    super(props);
    if (this.props.navigation.state.params.type === "edit") {
      const { vehicle } = this.props.navigation.state.params;
      this.state = {
        isLoading: false,
        vehicleId: vehicle.id,
        type: vehicle.type,
        detail: vehicle.detail,
        license: vehicle.license
      }
    } else {
      let { vehicleType } = this.props.navigation.state.params;

      this.state = {
        isLoading: false,
        type: vehicleType === undefined ? "sedan" : vehicleType,
        detail: "",
        license: ""
      }
    }

  }

  static navigationOptions = ({ navigation }) => {
    const screenType = navigation.state.params.type
    if (screenType === "add") {
      return {
        title: Strings("header.add_vehicle"),
        headerRight: (<View />)

      };
    } else {
      return {
        title: Strings("header.edit_vehicle"),
        headerRight: (
          <TouchableOpacity style={styles.headerRight}
            onPress={() => {
              navigation.state.params.removeVehicle();
            }}>
            <Image style={styles.iconDelete} source={require("../../../../assets/icons/ic_delete_2.png")} />
          </TouchableOpacity>
        )
      };
    }
  };

  removeVehicle = () => {
    //Toast.show(this.state.driverId + "", Toast.SHORT);
    let { vehicleId } = this.state;
    this.props.onDeleteVehicle({ vehicleId })
  }

  componentDidMount() {
    this.props.navigation.setParams({ removeVehicle: this.removeVehicle });
    const screenType = this.props.navigation.state.params.type;
    var defaultSelectedIndex = VEHICLE_TYPE.findIndex(item => item === this.state.type)
    if (screenType === "edit") {
      // defaultSelectedIndex = VEHICLE_TYPE.indexOf(this.state.type);
      this.props.onUpdateIndexUpdePicker(Constants.VEHICLE_TYPE_PICKER, defaultSelectedIndex)
    }
  }

  addVehicle = () => {
    const { detail, license } = this.state
    var type = VEHICLE_TYPE[this.props.vehicleTypeIndex];
    console.log("onAddVehicle", { type, detail, license });
    if (detail === "" && license === "") {
      Toast.show(Strings("message.not_null"), Toast.SHORT);
    } else {
      this.props.onAddVehicle({ type, detail, license })
    }
  }

  editVehicle = () => {
    let { vehicleId, detail, license } = this.state;
    var type = VEHICLE_TYPE[this.props.vehicleTypeIndex];
    this.props.onUpdateVehicle({ vehicleId, detail, license, type })
  }

  // componentWillReceiveProps(nextProps, prevState) {
  //   console.log("componentWillReceiveProps", nextProps, prevState)
  //   let { commonMessage } = nextProps;

  //   switch (commonMessage) {
  //     case Constants.MESSAGE_DELETE_SUCCESS:
  //       Toast.show(Strings("message.success"), Toast.SHORT);
  //       var dataSource = [...this.props.dataSource];
  //       var indexRemoved = dataSource.findIndex(item => item.id === this.state.vehicleId)
  //       if (indexRemoved !== -1) {
  //         dataSource.splice(indexRemoved, 1)
  //       }
  //       console.log("---------------------", dataSource, indexRemoved)
  //       this.props.removeItemVehicle(dataSource);
  //       this.props.navigation.goBack();
  //       break;
  //     case Constants.MESSAGE_UPDATE_SUCCESS:
  //       Toast.show(Strings("message.success"), Toast.SHORT);
  //       var { vehicleId, detail, license } = this.state;
  //       var type = VEHICLE_TYPE[this.props.vehicleTypeIndex];
  //       var newDatasource = [...this.props.dataSource];
  //       var indexUpdated = newDatasource.findIndex(item => item.id === vehicleId)
  //       if (indexUpdated !== -1) {
  //         newDatasource[indexUpdated].detail = detail;
  //         newDatasource[indexUpdated].license = license;
  //         newDatasource[indexUpdated].type = type;
  //       }
  //       this.props.removeItemVehicle(newDatasource);
  //       break;
  //     case Constants.MESSAGE_ADD_SUCCESS:
  //       Toast.show(Strings("message.success"), Toast.SHORT);
  //       this.props.onFetchData()
  //       this.props.navigation.goBack();
  //       break;
  //     case Constants.MESSAGE_FAIL:
  //       Toast.show(Strings("message.error"), Toast.SHORT);
  //       break;
  //     default:
  //       break;
  //   }

  //   // reset to prevent show Toast again
  //   this.props.resetCommonMessage()
  // }

  onChange = (e, name) => {
    this.setState({
      [name]: e.nativeEvent.text
    })
  }

  onUpdateIndex = (type, index) => {
    this.props.onUpdateIndexUpdePicker(type, index)
  }

  render() {
    const { isLoadingAddVehicle, isLoadingDeleteVehicle, isLoadingUpdateVehicle } = this.props;
    const isLoading = isLoadingAddVehicle || isLoadingDeleteVehicle|| isLoadingUpdateVehicle
    const screenType = this.props.navigation.state.params.type;

    return (
      <View style={styles.container}>
        <View style={styles.item}>
          <View style={styles.label}>
            <Image
              style={styles.icon}
              source={require("../../../../assets/icons/ic_notification.png")}
            />
            <Text style={styles.labelText}>{Strings("vehicle.type")}</Text>
            <Text style={styles.required}> *</Text>
          </View>


          <UpdePicker
            type={Constants.VEHICLE_TYPE_PICKER}
            options={VEHICLE_TYPE}
            callParentMethod={this.onUpdateIndex}
            value={this.props.vehicleTypeIndex}
            cancelIndex={VEHICLE_TYPE.length - 1}
            title={Strings("vehicle.select_type")}
          />

          <View style={styles.borderSpinder}></View>
        </View>
        <View style={styles.item}>
          <View style={styles.label}>
            <Image
              style={styles.icon}
              source={require("../../../../assets/icons/ic_edit_profile.png")}
            />
            <Text style={styles.labelText}>{Strings("vehicle.description")}</Text>
            <Text style={styles.required}> *</Text>
          </View>

          <TextInput onChange={(e) => this.onChange(e, "detail")} style={styles.input}  placeholderTextColor="#d6d6d6"  placeholder={Strings("vehicle.description")} value={this.state.detail}></TextInput>
        </View>
        <View style={styles.item}>
          <View style={styles.label}>
            <Image
              style={styles.icon}
              source={require("../../../../assets/icons/icon_add_license.png")}
            />
            <Text style={styles.labelText}>{Strings("vehicle.license_plate")}</Text>
            <Text style={styles.required}> *</Text>
          </View>

          <TextInput onChange={(e) => this.onChange(e, "license")} style={styles.input}  placeholderTextColor="#d6d6d6"  placeholder={Strings("vehicle.license_plate")} value={this.state.license} ></TextInput>
        </View>
        <View style={[styles.footer, { display: screenType === "add" ? "flex" : "none" }]}>
          <Ripple style={styles.btnAdd} onPress={() => this.addVehicle()}>
            <Text style={styles.addNew}>{Strings("vehicle.add")}</Text>
          </Ripple>
        </View>
        <View style={[styles.footer, { display: screenType === "edit" ? "flex" : "none" }]}>
          <Ripple style={styles.btnAdd} onPress={() => this.editVehicle()}>
            <Text style={styles.addNew}>{Strings("vehicle.update")}</Text>
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
  picker: {
    marginLeft: normalize(20),
    height: 50,
    width: "100%"
  },
  borderSpinder: {
    marginLeft: normalize(24),
    marginTop: normalize(0),
    height: 1,
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
  },
  input: {
    marginLeft: normalize(25),
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
  },
  button: {
    marginBottom: 10,
    fontWeight: '500',
  }
});


const mapStateToProps = (state) => {
  return {
    isLoadingAddVehicle: state.driverReducer.isLoadingAddVehicle,
    isLoadingUpdateVehicle: state.driverReducer.isLoadingUpdateVehicle,
    isLoadingDeleteVehicle: state.driverReducer.isLoadingDeleteVehicle,

    isLoading: state.driverReducer.isLoadingCommon,
    commonMessage: state.driverReducer.commonMessage,
    dataSource: state.driverReducer.vehicleList,
    vehicleTypeIndex: state.driverReducer.vehicleTypeIndex

  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchData: () => {
      dispatch(fetchVehicle())
    },
    onAddVehicle: (data) => {
      dispatch(requestAddVehicle(data))
    },
    onUpdateVehicle: (data) => {
      dispatch(requestUpdateVehicle(data))
    },
    onDeleteVehicle: (data) => {
      dispatch(requestDeleteVehicle(data))
    },
    resetCommonMessage: () => dispatch({ type: Constants.RESET_COMMON_MESSAGE }),
    removeItemVehicle: (data) => dispatch({ type: Constants.REMOVE_VEHICLE_LOCAL, payload: data }),
    onUpdateIndexUpdePicker: (type, index) => {
      dispatch({ type: type, payload: index })
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddVehicleScreen);