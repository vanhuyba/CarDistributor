import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { normalize } from "../../../../utils/ViewUtils";
import { normalizeUndefinedStr, preFixSerial, getDurationTextCarrental } from "../../../../utils/Utils";
import Ripple from 'react-native-material-ripple';
import ItemNotificationDetail from "../../../../components/ItemNotifyDetail";
import Colors from "../../../../assets/Colors";
import { TRIP_STATUS, TRIP_TYPE, DELIVERY_TYPE } from "../../../../data/Constants";
import AppOverlay from "../../../../components/AppOverlay";
import Spinner from "react-native-spinkit";

import {
  requestReassignDriver,
  requestAcceptBooking
} from "./AssignDriverAction";

import { connect } from "react-redux"
import Toast from "react-native-simple-toast";
class AssignDriverScreen extends Component {

  constructor(props) {
    super(props);
    let { note_of_salepoint, note_of_supplier, status, driver, vehicle_id, picked_vehicle_type, vehicle_license, vehicle_detail } = this.props.navigation.state.params.data;
    note_of_salepoint = normalizeUndefinedStr(note_of_salepoint);
    note_of_supplier = normalizeUndefinedStr(note_of_supplier);

    let vehicle;
    if (status === TRIP_STATUS.ACCEPT) {
      vehicle = {
        license: vehicle_license,
        id: vehicle_id,
        detail: vehicle_detail
      }
    }

    this.state = {
      driver: driver,
      vehicle: vehicle,
      noteForDriver: (status === TRIP_STATUS.CREATE || status === TRIP_STATUS.UPDATE) ? note_of_salepoint : note_of_supplier
    }
  }

  static navigationOptions = ({ navigation }) => {
    const title = Strings("notification.accept")
    return {
      title: title
    }
  };

  //startActivityForResult
  selectDriver = () => {
    this.props.navigation.navigate("DriverSelection", { onSelectedDriver: this.retriveDriver, driverId: this.state.driver === undefined ? "" : this.state.driver.id })
  }

  //onActivityResult
  retriveDriver = driver => {
    console.log("Driver", driver, driver.name, driver.phoneNumber);
    let vehicle;
    let vehicleId = driver.driver.vehicleId;
    if (vehicleId !== undefined) {
      vehicle = this.props.vehicleList.find(item => {
        return item.id === vehicleId
      })
    }
    this.setState({
      driver: driver.driver,
      vehicle: vehicle
    })

  }

  selectVehicle = () => {
    this.props.navigation.navigate("VehicleSelection", { onSelectedVehicle: this.retriveVehicle, vehicleId: this.state.vehicle === undefined ? "" : this.state.vehicle.id })
  }

  retriveVehicle = vehicle => {
    console.log("vehicle", vehicle);
    this.setState({
      vehicle: vehicle.vehicle,
    })

  }

  requestAcceptBooking = (data) => {
    let { driver, vehicle, noteForDriver } = this.state;
    console.log("requestAcceptBooking", driver, vehicle);
    if (driver === undefined) {
      Toast.show(Strings('message.driver_null'), Toast.LONG)
      return;
    }
    if (vehicle === undefined) {
      Toast.show(Strings('message.vehicle_null'), Toast.LONG)
      return;
    }
    const confirmData = {
      id_trip: data.id_trip,
      driverId: driver.id,
      driver_name: driver.name,
      driver_phoneNumber: driver.phoneNumber,
      vehicle_detail: vehicle.detail,
      vehicle_license: vehicle.license,
      vehicleId: vehicle.id,
      note_of_supplier: noteForDriver
    };
    let status = data.status;
    if (status === TRIP_STATUS.CREATE || status === TRIP_STATUS.UPDATE || (status === TRIP_STATUS.ACCEPT && !Boolean(data.vehicle_id))) {
      this.props.requestAcceptBooking(confirmData);
    } else if (status === TRIP_STATUS.ACCEPT && Boolean(data.vehicle_id)) {
      this.props.requestReassignDriver(confirmData);
    }
  }

  tripTypeTitle = (type) => {
    return type == TRIP_TYPE.DELIVERY ? Strings("AssignDriver.assign_de") : type == TRIP_TYPE.CAR_RENTAL ? Strings("AssignDriver.assign_car_rental") : Strings("AssignDriver.assign_up")
  }

  render() {
    const { data } = this.props.navigation.state.params;
    const { driver, vehicle } = this.state;
    return (
      <View style={styles.main}>
        <ScrollView>
          <View style={styles.content}>
            <View style={styles.summary}>
              <Text style={styles.tripType}>{this.tripTypeTitle(data.trip_type)}</Text>
              <View style={styles.wrapHeader}>
                <Text style={styles.serialLable}> {Strings("notification.serial_number")}
                  <Text style={{ color: "#ff8619" }}> {preFixSerial(data.trip_type, data.serial, data.appointment_serial)}</Text>
                </Text>
              </View>
              {
                data.trip_type === TRIP_TYPE.DELIVERY ?
                  <View>
                    {/* <ItemNotificationDetail title={Strings("AssignDriver.time_pick_up_luggage")} detail={data.time_leave} detailStyle={{ color: Colors.colorPrimary }} /> */}
                    <ItemNotificationDetail title={data.delivery_type === DELIVERY_TYPE.DELIVERY_AIRPORT_TO_STATION ? Strings("delivery.time_receive_luggage_airport") : Strings("delivery.time_return_luggage_airport")} detail={data.time_arrive} detailStyle={{ color: Colors.colorPrimary }} />
                    <ItemNotificationDetail title={Strings("delivery.from")} detail={data.name_leave} />
                    <ItemNotificationDetail title={Strings("delivery.to")} detail={data.name_arrive} border={false} />
                  </View>
                  :
                  data.trip_type === TRIP_TYPE.CAR_RENTAL ?
                    <View>
                      <ItemNotificationDetail title={Strings("AssignDriver.time_pick_up_passenger")} detail={data.time_leave} detailStyle={{ color: Colors.colorPrimary }} />
                      <ItemNotificationDetail title={Strings("notification.car_rental_duration")}
                        detail={getDurationTextCarrental(data.carrental_type)}
                        detailStyle={{ color: "#FF7900" }} />
                      <ItemNotificationDetail title={Strings("notification._at")} detail={data.name_leave} />
                    </View>
                    :
                    <View>
                      <ItemNotificationDetail title={Strings("AssignDriver.time_pick_up_passenger")} detail={data.time_leave} detailStyle={{ color: Colors.colorPrimary }} />
                      <ItemNotificationDetail title={Strings("notification._at")} detail={data.name_leave} />
                      <ItemNotificationDetail title={Strings("notification._arrive")} detail={data.name_arrive} border={false} />
                    </View>

              }

            </View>

            <View style={styles.driverInfo}>
              <Text style={styles.title}>{Strings("header.note_for_driver")}</Text>
              <View
                style={styles.driverWrapper}
              >
                <TextInput
                  placeholderTextColor="#d6d6d6"
                  style={styles.input}
                  placeholder={Strings("header.edit_note")}
                  multiline={true}
                  maxLength={200}
                  onChangeText={(text) => this.setState({ noteForDriver: text })}
                  value={this.state.noteForDriver}
                />
              </View>
            </View>

            <Ripple style={styles.row}
              onPress={() => {
                this.selectDriver()
              }}>
              <View style={styles.rowLeft}>
                <Text style={styles.title}>{Strings("notification.driver_info")}</Text>
                <View
                  style={styles.driverWrapper}

                >
                  {
                    (driver != undefined) ?
                      <View style={styles.userInfo}>
                        <Text style={styles.name}>{driver.name}</Text>
                        <Text style={styles.phoneNumber}>{driver.phoneNumber}</Text>
                      </View>
                      :
                      <View style={styles.userInfo}>
                        <Text style={styles.name}>{Strings("notification.select_driver")}</Text>
                      </View>
                  }

                </View>
              </View>
              <View>
                <Image
                  style={styles.iconNavigate}
                  source={require('../../../../assets/icons/ic_navigate.png')}

                />
              </View>
            </Ripple>

            <Ripple
              onPress={() => {
                this.selectVehicle()
              }}
              style={styles.row}
            >
              <View style={styles.rowLeft}>
                <Text style={styles.title}>{Strings("notification.vehicle_info")}</Text>
                <View
                  style={styles.driverWrapper}

                >
                  {
                    (vehicle != undefined) ?
                      <View style={styles.userInfo}>
                        <Text style={styles.name}>{vehicle.detail}</Text>
                        <Text style={styles.phoneNumber}>{vehicle.license}</Text>
                      </View> :
                      <View style={styles.userInfo}>
                        <Text style={styles.name}>{Strings("notification.select_vehicle")}</Text>
                      </View>
                  }

                </View>
              </View>


              <View>
                <Image
                  style={styles.iconNavigate}
                  source={require('../../../../assets/icons/ic_navigate.png')}
                />
              </View>
            </Ripple>

          </View>

        </ScrollView>

        <View style={styles.footer}>
          <Ripple style={styles.btnAssign} onPress={() => this.requestAcceptBooking(data)}>
            <Text style={styles.btn}>Điều tài xế</Text>
          </Ripple>
        </View>
        <AppOverlay
          loadingIcon="ThreeBounce"
          isVisible={this.props.isLoadingAssignDriver || this.props.isLoadingReassingDriver}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  main: {
    width: "100%",
    height: "100%",
    backgroundColor: "#E5E5E5",
    flexDirection: "column",
  },
  summary: {
    width: "100%",
    height: "auto",
    backgroundColor: Colors.colorWhite,
  },
  row: {
    marginTop: normalize(8),
    width: "100%",
    height: "auto",
    backgroundColor: "#FF0000",
    backgroundColor: Colors.colorWhite,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  rowLeft: {
    flex: 1
  },
  driverInfo: {
    marginTop: normalize(8),
    width: "100%",
    height: "auto",
    backgroundColor: "#FF0000",
    backgroundColor: Colors.colorWhite,
  },
  vehicleInfo: {
    marginTop: normalize(8),
    width: "100%",
    height: "auto",
    backgroundColor: Colors.colorWhite,
  },
  title: {
    marginTop: normalize(12),
    paddingHorizontal: normalize(12),
    fontSize: normalize(14),
    fontWeight: "bold",
    color: Colors.colorLighterGrey
  },
  tripType: {
    marginTop: normalize(12),
    paddingHorizontal: normalize(12),
    fontSize: normalize(14),
    fontWeight: "bold",
    color: Colors.colorPrimary
  },
  serialLable: {
    flex: 9,
    fontSize: normalize(13),
    fontWeight: "600",
    color: "black"
  },
  serialValue: {
    flex: 10,
    fontSize: normalize(13),
    textAlign: "right",
    color: "#ff8619"
  },
  wrapHeader: {
    flexDirection: "row",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(14)
  },
  driverWrapper: {
    width: "100%",
    height: "auto",
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    height: "auto"
  },
  userInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  name: {
    fontWeight: "normal",
    fontSize: normalize(14),
  },
  email: {
    fontSize: normalize(9),
    color: Colors.colorPrimaryDark,
  },
  phoneNumber: {
    fontSize: normalize(9),
    color: Colors.colorPrimaryDark,
  },
  iconNavigate: {
    resizeMode: "contain",
    marginLeft: 4,
    marginRight: normalize(16),
    width: 20,
    height: 20,
  },
  footer: {
    height: "auto",
    backgroundColor: Colors.colorWhite,
    width: "100%",
    alignItems: "center",
  },
  btnAssign: {
    width: "80%",
    marginVertical: normalize(20),
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    backgroundColor: "#FF7900",
    borderRadius: 20
  },
  btn: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700"
  },
  input: {
    marginHorizontal: normalize(12),
    flex: 1,
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
    paddingBottom: 2,
    maxHeight: 120

  },
})
const mapStateToProps = (state) => {
  return {
    isLoadingAssignDriver: state.notificationReducer.isLoadingAssignDriver,
    isLoadingReassingDriver: state.notificationReducer.isLoadingReassingDriver,
    vehicleList: state.driverReducer.vehicleList,

  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    requestReassignDriver: (data) => {
      dispatch(requestReassignDriver(data))
    },
    requestAcceptBooking: (data) => {
      dispatch(requestAcceptBooking(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AssignDriverScreen)