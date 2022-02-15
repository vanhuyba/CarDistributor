import React, { Component } from "react";
import {
  Image,
  PermissionsAndroid,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Dimensions,
  Slider
} from "react-native";
import TicketFooter from '../common/TicketFooter';
import Ripple from 'react-native-material-ripple';

import ShotcutImageLuggage from "../../../../components/Image/ShotcutImageLuggage"
import { Button, Divider } from "react-native-elements";
import ViewShot from "react-native-view-shot";
import UpdePicker from "../../../../components/Picker/UpdePicker";
import {
  formatVND,
  standardizeDateStringDetail,
  screenshots,
  copyToClipboard,
  preFixSerial
} from "../../../../utils/Utils";
import renderIf from "../../../../utils/RenderHelper";
import Colors from "../../../../assets/Colors";
import Constants, { TRIP_STATUS, DELIVERY_TYPE } from "../../../../data/Constants";
import Spinner from "react-native-spinkit";
import ItemNotificationDetail from "../../../../components/ItemNotifyDetail";
import { normalize } from "../../../../utils/ViewUtils";
import Strings from "../../../../utils/LocalizationHelper";
import ImageSlider from "../../../../components/Image/ImageSlider"

export default class DeliveryNotificationDetailScreen extends Component {

  constructor(props) {
    super(props);
    this.props.navigation.setParams({
      header: true
    });
  }

  static navigationOptions = ({ navigation }) => {
    let showHeader = navigation.state.params.header;
    if (showHeader || showHeader === undefined) {
      return {
        title: "Thông tin chuyển đồ"
      }
    };
    return {
      header: null
    }
  }

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

  getTextReceiveOrReturn = (type) => {
    if (type === DELIVERY_TYPE.DELIVERY_AIRPORT_TO_STATION) return Strings("delivery.time_receive_luggage_airport")
    return Strings("delivery.time_return_luggage_airport")
  }

  _copyToClipboard = (type, data) => {
    let copyContent = "" +
      "Ticket No: " + preFixSerial(data.trip_type, data.serial, data.appointment_serial) +
      "\n" + this.getTextReceiveOrReturn(data.delivery_type) + data.time_arrive +
      "\n" + Strings("notification._customer") + data.name_customer +
      "\n" + Strings("delivery.from") + data.name_leave +
      "\n" + Strings("delivery.to") + data.name_arrive +
      "\n" + Strings("delivery.number_items") + data.package_total;

    if (data.driver != undefined) {
      copyContent += ("\n" + Strings("notification.driver_info") + data.driver.name + " - " + data.driver.phoneNumber + "")
    }

    if (type === Constants.COMPLETED)
      copyContent += "\n" + Strings("notification._completed_time") + standardizeDateStringDetail(data.time_complete);

    copyContent += ("\n" + Strings("notification.system_price") + formatVND(data.system_price));
    copyContent += ("\n" + Strings("delivery.price_whalelo") + formatVND(data.whalelo_price));
    copyContent += ("\n" + Strings("notification.extra_price_supplier") + formatVND(data.extra_price_supplier));
    copyContent += ("\n" + Strings("delivery.total_price") + formatVND(data.total_price));

    if (data.vehicle_detail) {
      copyContent += ("\n" + Strings("notification.vehicle_info") + data.vehicle_detail)
    }

    if (data.vehicle_license) {
      copyContent += (" - " + data.vehicle_license + "")
    }

    copyToClipboard(copyContent)

  };

  onErrorImageLoader = () => {
    console.log("onErrorImageLoader")
  }

  checkImageHide = () => {
    this.props.navigation.setParams({
      header: true
    });
  }

  openImage = (src) => {
    this.imageSlider.updateState("src", src);
    this.props.navigation.setParams({
      header: false
    });
  }


  render() {
    const { type, data } = this.props.navigation.state.params;
    const listImage = data.package_images;

    return (
      <View style={styles.container}>
        <ImageSlider
          onImageInvisible={() => this.checkImageHide()}
          ref={instance => this.imageSlider = instance}
        />
        <ScrollView style={{ flex: 1 }} collapsable={false}>
          <ViewShot ref="viewShot"
            style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
            <View style={styles.rowHeader}>
              <Text style={styles.textColor}>{Strings("notification.serial_number")}
                <Text style={styles.serial}>{preFixSerial(data.trip_type, data.serial, data.appointment_serial)}</Text></Text>

            </View>

            {/* this is exact time when driver receive or return luggage for passenger at the airport*/}
            <ItemNotificationDetail title={this.getTextReceiveOrReturn(data.delivery_type)} detail={data.delivery_type === DELIVERY_TYPE.DELIVERY_AIRPORT_TO_STATION ? data.time_leave : data.time_arrive}
              detailStyle={{ color: "#FF7900" }} />

            <ItemNotificationDetail title={Strings("notification._customer")} detail={data.name_customer} />
            <ItemNotificationDetail title={Strings("delivery.number_items")} detail={data.package_total} />

            <ItemNotificationDetail title={Strings("delivery.from")} detail={data.name_leave} />
            <ItemNotificationDetail title={Strings("delivery.to")} detail={data.name_arrive} />
            {renderIf(data.flight_code, <ItemNotificationDetail
              title={Strings("notification.flight_code")}
              detail={data.flight_code}
            />)}
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

            <ItemNotificationDetail title={Strings("notification.system_price")}
              detail={formatVND(data.system_price)}
              detailStyle={{ color: "#ff8619" }} />

            <ItemNotificationDetail title={Strings("delivery.price_whalelo")}
              detail={formatVND(data.whalelo_price)}
              detailStyle={{ color: "#ff8619" }} />

            <ItemNotificationDetail title={Strings("notification.extra_price_supplier")}
              detail={formatVND(data.extra_price_supplier)}
              detailStyle={{ color: "#ff8619", fontWeight: "600" }} />

            <ItemNotificationDetail title={Strings("delivery.total_price")}
              detail={formatVND(data.total_price)}
              detailStyle={{ color: "#FF7900" }} />

            <ItemNotificationDetail title={Strings("notification.cash_method")}
              detail={data.payment_method === Constants.PAYMENT_CASH ? Strings("notification.driver_receive") : Strings("notification.paid")}
              detailStyle={{ color: "#ff8619", fontWeight: "600" }} />

            {
              listImage.length === 0 ?
                // LIST_IMG.length === 0 ?
                null
                :
                <View style={styles.listImgItems}>
                  <FlatList
                    style={styles.flatListImage}
                    horizontal={true}
                    data={listImage}
                    // data={LIST_IMG}
                    showsHorizontalScrollIndicator={false}
                    ListFooterComponent={() => {
                      return <View style={{ width: 8 }}></View>
                    }}
                    renderItem={({ item, index }) => (
                      // <Ripple
                      //   onPress={() => this.openImage(item)}
                      // >
                      <ShotcutImageLuggage
                        onOpenImage={() => this.openImage(item)}
                        uri={item} />
                      // </Ripple>
                    )}
                  />
                  <Divider style={styles.dividerUnderImg} />
                </View>
            }
            {
              data.delivery_type === DELIVERY_TYPE.DELIVERY_STATION_TO_AIRPORT ?
                <View style={styles.wrapNote}>
                  <Text style={styles.note}>{Strings("delivery.note_for_return_luggage")}</Text>
                </View> : null
            }
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
  serial: {
    fontSize: normalize(13),
    textAlign: "right",
    color: "#FF7900"
  },
  note: {
    fontSize: 12,
    color: "#FF0000",
  },
  wrapNote: {
    paddingHorizontal: normalize(14),
    marginTop: normalize(16)
  },
  container: {
    flex: 1
  },

  flatListImage: {
    marginVertical: normalize(16)
  },
  listImgItems: {
    display: "flex",
    width: "100%",
    height: "auto",
  },
  rowHeader: {
    flexDirection: "row",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(14)
  },
  textColor: {
    flex: 1,
    fontSize: normalize(13),
    fontWeight: "600",
    color: "black"
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
