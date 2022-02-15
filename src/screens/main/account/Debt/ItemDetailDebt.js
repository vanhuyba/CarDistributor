import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { normalize } from "../../../../utils/ViewUtils";
import { formatVND, preFixSerial, countItem } from "../../../../utils/Utils";
import Ripple from 'react-native-material-ripple';
import { TRIP_TYPE, PAYMENT_METHOD } from "../../../../data/Constants"

const ICON_PAYMENT = {
  pay_online: require('../../../../assets/icons/icon_payment_online.png'),
  cash: require('../../../../assets/icons/icon_payment_cash.png'),
  cash_by_host: require('../../../../assets/icons/icon_payment_cash.png'),
  debt: require('../../../../assets/icons/icon_payment_debt.png'),

}

const ICON_TRIP_TYPE = {
  DE: require('../../../../assets/icons/icon_luggage.png'),
  UP: require('../../../../assets/icons/icon_add_user.png'),
}

class ItemDetailDebt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isExpander: false
    }
  }

  setExpander = () => {
    this.setState((prevState) => ({
      isExpander: !prevState.isExpander
    }))
  }

  getIconTripType = (type) => {
    if (type === TRIP_TYPE.DELIVERY) return ICON_TRIP_TYPE.DE
    return ICON_TRIP_TYPE.UP
  }

  getTripTypeText = (type) => {
    if (type === TRIP_TYPE.DELIVERY) {
      return Strings('label.trip_type_de')
    } else if (type === TRIP_TYPE.CAR_RENTAL) {
      return Strings('label.trip_type_cr')
    } else {
      return Strings('label.trip_type_up')
    }
  }

  showTotalPriceByType = (trip) => {
    return trip.price || trip.total_price
  }

  render() {
    const { isExpander } = this.state;
    const { data } = this.props;
    // rate: tiền F1 nhận được hoặc tiền F1 nợ
    // cash: F1 nợ
    // Payonline - Debt: F1 nhận được
    var rate = 0;
    var rateStyle;
    if (data.payment_method == PAYMENT_METHOD.PAYMENT_CASH || data.payment_method == PAYMENT_METHOD.PAYMENT_CASH_HOST) {
      rate = data.price_supplier - data.price;
      if (rate >= 0) {
        //he thong no ban
        rateStyle = styles.debtvnd
      } else {
        //ban no he thong
        rateStyle = styles.cashVnd
      }
    } else {
      //he thong no ban
      rateStyle = styles.debtvnd
      rate = data.price_supplier
    }

    const PAY_MENTHOD = {
      cash: Strings("label.text_cash"),
      cash_by_host: Strings("label.text_cash"),
      debt: Strings("label.text_debt"),
      pay_online: Strings("label.text_online")
    }

    return (
      <View style={styles.main}>
        <Ripple style={styles.summary}
          onPress={() => this.setExpander()}
        >
          <View style={styles.top}>
            <Text style={{ ...styles.grayText, ...styles.left }}>{Strings("label.serial")}: {preFixSerial(data.trip_type, data.serial, data.appointment_serial)}</Text>
            <Text style={styles.grayText}>{data.time_leave}</Text>
          </View>

          <View style={styles.top}>
            <Image style={styles.icon} source={ICON_PAYMENT[data.payment_method]} />
            <Text style={{ ...styles.grayText, ...styles.left }}>{PAY_MENTHOD[data.payment_method]}</Text>
            <Text style={{ ...styles.grayText, ...rateStyle }}>{`${rate >= 0 ? "+" : "-"} ${formatVND(Math.abs(rate))}`}</Text>
          </View>

          <View style={styles.bottom}>
            <View style={styles.wrapIcon}>
              <Image style={styles.iconType} source={this.getIconTripType(data.trip_type)} />
            </View>
            <Text style={{ ...styles.grayText, ...styles.left }}>{this.getTripTypeText(data.trip_type)}</Text>
            <Text style={styles.blackText}>{data.trip_type === TRIP_TYPE.DELIVERY ? countItem(data.package_total, "item") : data.name_customer}</Text>
          </View>

        </Ripple>

        {
          isExpander &&
          <View style={styles.expand}>
            <View style={styles.hr}></View>

            {/* <View style={styles.row}>
              <Text style={styles.label}>{Strings("notification.cash_method")}</Text>
              <Text style={styles.value}>{PAY_MENTHOD[data.payment_method]}</Text>
            </View> */}
            <View style={styles.row}>
              <Text style={styles.label}>{Strings("notification.system_price")}</Text>
              <Text style={styles.value}>{formatVND(this.showTotalPriceByType(data))}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{Strings("label.receive_text")}</Text>
              <Text style={styles.value}>{formatVND(data.price_supplier)}</Text>
            </View>
            
            <View style={styles.row}>
              <Text style={styles.label}>{rate >= 0 ? Strings("label.sotienhethongnoban") : Strings("label.sotienbannohethong")}</Text>
              <Text style={styles.value}>{formatVND(Math.abs(rate))}</Text>
            </View>
            
          </View>
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 8,
    height: "auto",
    marginTop: normalize(8),
    flexDirection: "column",
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
  },
  summary: {
    display: "flex",
    width: "100%"
  },
  top: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bottom: {
    marginBottom: normalize(4),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  grayText: {
    color: "rgb(157, 157, 157)",
    fontSize: normalize(12),
    lineHeight: normalize(14)
  },
  icon: {
    width: 30,
    height: 25,
    resizeMode: 'contain',
    marginRight: normalize(4)
  },
  wrapIcon: {
    width: 30,
    height: 16,
    borderWidth: 0.7,
    borderRadius: 4,
    marginRight: normalize(4),
    alignItems: "center",
    display: "flex",
    justifyContent: "center",
    borderColor: "#FF7900",
  },
  iconType: {
    width: 10,
    height: 10,
    resizeMode: 'contain',
  },
  left: {
    flex: 1,
  },
  blackText: {
    color: "#000",
    fontWeight: "600",
    fontSize: normalize(14),
    lineHeight: normalize(17)
  },
  debtvnd: {
    fontWeight: "bold",
    color: "rgb(59, 78, 220)",
    fontSize: normalize(12),
    lineHeight: normalize(14)
  },
  cashVnd: {
    fontWeight: "bold",
    color: "red",
    fontSize: normalize(12),
    lineHeight: normalize(14)
  },
  hr: {
    marginVertical: normalize(12),
    height: 1,
    width: "100%",
    backgroundColor: "#d6d6d6"
  },
  expand: {
    display: "flex",
    width: "100%"

  },
  label: {
    fontSize: normalize(12),
    color: "#000",
    flex: 1,
    lineHeight: normalize(14)
  },
  value: {
    fontSize: normalize(12),
    color: "#000",
    lineHeight: normalize(14)
  },
  row: {
    flexDirection: "row"
  }
})

export default ItemDetailDebt