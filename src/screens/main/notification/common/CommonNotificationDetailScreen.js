import React, { Component } from "react";
import {
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Picker,
  Dimensions
} from "react-native";
import TicketFooter from './TicketFooter';

import CameraRoll from "@react-native-community/cameraroll";
import Modal from "react-native-modal";
import { Button } from "react-native-elements";
import ViewShot from "react-native-view-shot";
import UpdePicker from "../../../../components/Picker/UpdePicker";
import {
  formatVND,
  getTitle,
  standardizeDateStringDetail,
  standardizeDateStringLite,
  screenshots,
  copyToClipboard,
  preFixSerial,
  getDurationTextCarrental
} from "../../../../utils/Utils";
import renderIf from "../../../../utils/RenderHelper";
import Colors from "../../../../assets/Colors";
import Constants, { TRIP_STATUS, TRIP_TYPE, PAYMENT_METHOD } from "../../../../data/Constants";
import Spinner from "react-native-spinkit";
import ItemNotificationDetail from "../../../../components/ItemNotifyDetail";
import { normalize } from "../../../../utils/ViewUtils";
import Toast from "react-native-simple-toast";
import Strings from "../../../../utils/LocalizationHelper";
const deviceHeight = Dimensions.get('window').height;

const CANCEL_OPTION = "CANCEL"

export default class CommonNotificationDetailScreen extends Component {

  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    let type = navigation.state.params.type
    const title = getTitle(type)
    return {
      title: title
    }
  };

  requestCompleteBooking(data) {
    this.props.requestConfirmComplete({ data: data });
  }

  openAssignDriverScreen = (data) => {
    this.props.navigation.navigate("AssignDriverScreen", { data: data })
  }

  _onPress = (type, data) => {
    this.openAssignDriverScreen(data);
  };

  componentWillUnmount() {
  }

  _copyToClipboard = (type, data) => {
    let copyContent = "" +
      "Ticket No: #" + preFixSerial(data.trip_type) + "" + data.serial +
      "\n" + Strings("notification.time_to_pick_up") + standardizeDateStringLite(data.time_leave) +
      "\n" + Strings("notification._customer") + data.name_customer + "" +
      "\n" + Strings("notification._phone_number") + data.phone_number + "" +
      "\n" + Strings("notification._at") + data.name_leave + "" +
      "\n" + Strings("notification._arrive") + data.name_arrive;

    if (data.flight_code)
      copyContent += ("\n" + Strings("notification.flight_code") + data.flight_code);

    if (data.house_name)
      copyContent += ("\n" + Strings("notification.house_name") + data.house_name);

    copyContent += "\n" + Strings("notification._vehicle_type") + data.vehicle_type + "";

    if (type === Constants.COMPLETED)
      copyContent += "\n" + Strings("notification._completed_time") + standardizeDateStringDetail(data.time_complete);


    // if (data.system_price)
    //   copyContent += ("\n" + Strings("notification.system_price") + formatVND(data.system_price));

    // if (data.extra_price_salepoint)
    //   copyContent += ("\n" + Strings("notification.extra_price_salepoint") + formatVND(data.extra_price_salepoint));

    if (data.price)
      copyContent += ("\n" + Strings("notification.total_price") + formatVND(data.price));

    if (data.driver != undefined) {
      copyContent += ("\n" + Strings("notification.driver_info") + data.driver.name + " - " + data.driver.phoneNumber + "")
    }

    if (data.vehicle_detail) {
      copyContent += ("\n" + Strings("notification.vehicle_info") + data.vehicle_detail)
    }

    if (data.vehicle_license) {
      copyContent += (" - " + data.vehicle_license + "")
    }

    if (data.note_of_salepoint)
      copyContent += ("\n" + Strings("notification._note_of_customer") + data.note_of_salepoint);

    if (data.note_of_supplier)
      copyContent += ("\n" + Strings("notification._note_for_supplier") + data.note_of_supplier);

    copyToClipboard(copyContent)

  };

  getPaymentMethod = (type) => {
    if(type === PAYMENT_METHOD.PAYMENT_CASH) {
      return Strings("notification.driver_receive_passenger")
    } else if(type === PAYMENT_METHOD.PAYMENT_CASH_HOST) {
      return Strings("notification.driver_receive_host")
    } else {
      return Strings("notification.paid")
    }
  }
  render() {
    const { type, data } = this.props.navigation.state.params;
    //data.price_salepoint + data.comm_upde
    const priceSalepoint = data.price_salepoint || 0;
    const priceUpde = data.comm_upde || 0;
    const systemPrice = priceSalepoint + priceUpde;
    var disCountPrice = data.discount_price_upde;

    if(systemPrice < 0) {
      //discount
      disCountPrice -= systemPrice
    }
    return (
      <View style={styles.container}>
        <ScrollView collapsable={false}>
          <ViewShot ref="viewShot"
            style={{ backgroundColor: "white" }}>
            <View style={styles.body}>
              <Text style={styles.th}>
                {Strings("notification.serial_number")}
                <Text style={{ color: "#FF7900" }}>{preFixSerial(data.trip_type, data.serial, data.appointment_serial)}</Text></Text>

            </View>

            <ItemNotificationDetail title={Strings("notification.time_to_pick_up")}
              detail={data.time_leave}
              detailStyle={{ color: "#FF7900" }} />
            {
              data.trip_type == TRIP_TYPE.CAR_RENTAL ?
                <ItemNotificationDetail title={Strings("notification.car_rental_duration")}
                  detail={getDurationTextCarrental(data.carrental_type)}
                  detailStyle={{ color: "#FF7900" }} /> : null
            }

            <ItemNotificationDetail title={Strings("notification._customer")} detail={data.name_customer} />
            {/* <ItemNotificationDetail title={Strings("notification._email")} detail={data.email} /> */}
            <ItemNotificationDetail title={Strings("notification._phone_number")} detail={data.phone_number} />
            {
              Boolean(data.phone_passenger) ?
                <ItemNotificationDetail title={Strings("notification.phone_number_passenger")} detail={data.phone_passenger} />
                : null
            }

            <ItemNotificationDetail title={Strings("notification._at")} detail={data.name_leave} />

            {
              data.trip_type == TRIP_TYPE.CAR_RENTAL ? null : <ItemNotificationDetail title={Strings("notification._arrive")} detail={data.name_arrive} />
            }

            {renderIf(data.flight_code, <ItemNotificationDetail
              title={Strings("notification.flight_code")}
              detail={data.flight_code}
            />)}

            {renderIf(data.house_name, <ItemNotificationDetail
              title={Strings("notification.house_name")}
              detail={data.house_name}
            />)}
            <ItemNotificationDetail title={Strings("notification._vehicle_type")} detail={data.vehicle_type} />

            {renderIf(type === Constants.COMPLETED, <ItemNotificationDetail
              title={Strings("notification.time_to_completed")}
              detail={standardizeDateStringDetail(data.time_complete)}
            />)}

            <ItemNotificationDetail title={Strings("notification.system_price")}
              detail={formatVND(data.net_price_supplier - data.discount_price_supplier)}
              detailStyle={{ color: "#FF7900" }} />

            {
              systemPrice > 0 ?
                <ItemNotificationDetail title={Strings("notification.extra_price_salepoint")}
                  detail={formatVND(systemPrice)}
                  detailStyle={{ color: "#FF7900" }} /> : null
            }

            {
              disCountPrice > 0 ?
                <ItemNotificationDetail title={Strings("notification.discount_price")}
                  detail={`-${formatVND(disCountPrice)}`}
                  detailStyle={{ color: "#FF7900" }} /> : null
            }

            {
              data.extra_price_supplier > 0 ?
                <ItemNotificationDetail title={Strings("notification.extra_price_supplier")}
                  detail={formatVND(data.extra_price_supplier)}
                  detailStyle={{ color: "#FF7900", fontWeight: "600" }} /> : null
            }

            {
              Boolean(data.upde_vat_price) ?
                <ItemNotificationDetail title={Strings("notification.vat_price")}
                  detail={formatVND(data.upde_vat_price)}
                  labelStyle={{ fontWeight: "700" }}
                  detailStyle={{ color: "#FF7900", fontWeight: "700" }} /> : null
            }

            <ItemNotificationDetail title={Strings("notification.total_price")}
              detail={formatVND(data.total_price || data.price)}
              detailStyle={{ color: "#FF7900", fontWeight: "600" }} />

            <ItemNotificationDetail title={Strings("notification.cash_method")}
              detail={this.getPaymentMethod(data.payment_method)}
              detailStyle={{ color: "#FF7900", fontWeight: "700" }} />

            {renderIf(
              data.note_of_salepoint,
              <ItemNotificationDetail title={Strings("notification._note_of_customer")}
                detail={data.note_of_salepoint} />
            )}

            {renderIf(
              data.note_of_supplier,
              <ItemNotificationDetail title={Strings("notification._note_for_supplier")}
                detail={data.note_of_supplier} />
            )}

            {
              data.driver !== undefined ?
                <ItemNotificationDetail title={Strings("notification.driver_info")}
                  detail={`${data.driver.name} \n ${data.driver.phoneNumber}`} /> : null
            }

            {renderIf(
              data.vehicle_detail,
              <ItemNotificationDetail title={Strings("notification.vehicle_info")}
                detail={`${Strings("vehicle.type")}: ${data.picked_vehicle_type} \n ${Strings("vehicle.description")}: ${data.vehicle_detail} \n ${Strings("vehicle.license_plate")}: ${data.vehicle_license}`} />
            )}
          </ViewShot>
        </ScrollView>

        <TicketFooter
          screenShot={() => screenshots(this.refs.viewShot)}
          copy={() => this._copyToClipboard(type, data)}
          assignDriver={() => this._onPress(type, data)}
          requestCompleteBooking={() => this.requestCompleteBooking(data)}
          type={type}
          data={data}
        />
      </View>
    );
  }

  async componentDidMount() {
    this.props.resetDetailState();
    this.props.onFetchDataDriver(); //fetch list driver
    this.props.onFetchVehicles();
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  th: {
    flex: 9,
    fontSize: normalize(13),
    fontWeight: "600",
    color: "black"
  },
  body: {
    flexDirection: "row",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(14)
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

  buttonCancelBooking: {
    backgroundColor: Colors.colorWhite,
    borderRadius: normalize(18),
    borderWidth: 1,
    borderColor: Colors.colorPrimary,
    height: normalize(26),
    padding: 0,
    width: "100%"
  },

  titleAccept: { color: Colors.colorWhite, fontWeight: "800", fontSize: normalize(10) },
  titleCancel: { color: Colors.colorPrimary, fontWeight: "800", fontSize: normalize(10) },

  buttonAdditionText: {
    textAlign: "center",
    fontSize: normalize(8),
    color: "#00B1FF",
    marginTop: normalize(5),
    fontWeight: "500"
  },
  headerTitle: {
    fontSize: 16,
    color: "#FF7900",
    fontWeight: "700"
  },
  line: {
    backgroundColor: "#d6d6d6",
    width: "100%",
    height: 1
  },
  picker: {
    marginLeft: 20,
    height: 50,
    width: "100%"
  },
  borderSpinder: {
    marginLeft: 28,
    marginTop: -4,
    height: 1,
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
  },
  input: {
    marginLeft: 28,
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
    paddingBottom: 2,
    maxHeight: 120

  },
  item: {
    marginTop: 16,
    height: "auto",
    width: "100%"
  },
  label: {
    flexDirection: "row",
    width: "100%",
    height: "auto"

  },
  labelText: {
    marginLeft: 8
  },
  icon: {
    width: 20,
    height: 20,
  },
  required: {
    color: "#FF0000"
  },
  selecter: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  wrapPicker: {
    flex: 1,
  },
  iconAdd: {
    marginLeft: 16,
    width: 20,
    height: 20
  },
  reassignDriverText: {
    color: "#00B1FF",
    fontSize: 14,
    marginHorizontal: 16,
  }

});
