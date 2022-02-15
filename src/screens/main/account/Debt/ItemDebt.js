import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { normalize } from "../../../../utils/ViewUtils";
import { formatVND } from "../../../../utils/Utils";
import Ripple from 'react-native-material-ripple';

const ICON_STATUS = {
  pending: require('../../../../assets/icons/ic_debt_pendding.png'),
  complete: require('../../../../assets/icons/ic_debt_success.png'),
}

const DEBT_STATUS = {
  pending: "Chưa thanh toán",
  complete: "Đã thanh toán"
}

const STATUS = {
  success: "complete",
  pending: "pending"
}

class ItemDebt extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const { status, moneyKeeped, debt, from_time } = this.props;
    const date = new Date(from_time);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    var textDebt = Strings("label.bannohethong");
    if (debt <= 0) textDebt = Strings("label.hethongnoban");

    return (
      <Ripple style={styles.main}
        onPress={() => {
          this.props.navigation.navigate('DetailDebtByMonth', {time: from_time})
        }}
      >
        <View style={styles.wrapMonth}>
          <View style={styles.wrapIcon}>
            <Image
              style={styles.icon}
              source={ICON_STATUS[status]}
            />
          </View>
          <Text style={styles.textMonth}> {`${Strings("label.month")} ${month}`}</Text>
          <Text style={styles.textMonth}>{year}</Text>
        </View>

        <View style={styles.wrapValue}>
          <View style={styles.line}>
            <Text style={styles.labelDebt}>{textDebt}</Text>
            <Text style={styles.moneyDebt}>{formatVND(Math.abs(debt))}</Text>
          </View>
          <View style={styles.line}>
            <Text style={styles.labelKeeped}>{Strings("label.sotienbanthutukhach")}</Text>
            <Text style={styles.moneyKeeped}>{formatVND(moneyKeeped)}</Text>
          </View>
          <View style={styles.line}>
            <Text style={status === STATUS.success ? styles.statusSuccess : styles.statusPendding}>{DEBT_STATUS[status]}</Text>
          </View>
        </View>

      </Ripple>
    )
  }

}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    paddingHorizontal: 16,
    paddingVertical: 16,
    height: "auto",
    flexDirection: "row",
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
  },
  wrapIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#d6d6d6",
    borderWidth: 1,
    padding: 4,
  },
  icon: {
    resizeMode: "contain",
    width: 20,
    height: 20,
  },
  wrapMonth: {
    width: 60,
    marginRight: 8,
    height: "auto",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapValue: {
    flex: 1,
  },
  textMonth: {
    fontSize: normalize(10)
  },
  line: {
    width: "100%",
    marginTop: 4,
    flexDirection: "row",
  },
  labelDebt: {
    fontSize: normalize(14),
    flex: 1,
    color: "rgb(50, 177, 227)",
  },
  moneyDebt: {
    fontSize: normalize(14),
  },
  labelKeeped: {
    fontSize: normalize(10),
    flex: 1,
  },
  moneyKeeped: {
    fontSize: normalize(10),
  },
  statusPendding: {
    fontSize: normalize(10),
    color: "rgb(255, 0, 0)"
  },
  statusSuccess: {
    fontSize: normalize(10),
    color: "rgb(106, 177, 197)"
  }

})

export default ItemDebt