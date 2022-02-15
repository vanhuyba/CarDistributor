import React, { Component } from 'react';
import { FlatList, StyleSheet, View, Platform } from 'react-native';
import ItemNotification from "../../../../components/ItemNotitication";
import Colors from "../../../../assets/Colors";
import Spinner from 'react-native-spinkit';
import Constants, { TRIP_TYPE, PAYMENT_CASH, PAYMENT_METHOD } from "../../../../data/Constants";
import Toast from 'react-native-simple-toast';
import showNotification from "../../../../utils/NotificationUtils";
import Strings from "../../../../utils/LocalizationHelper";
import { getScreenByNotifyType, preFixSerial, formatVND } from "../../../../utils/Utils";
import {normalize} from "../../../../utils/ViewUtils"
import * as FirebaseLog from "../../../../utils/FirebaseLog"

export class CommonNotificationScreen extends Component {

  componentDidMount() {
    // FirebaseLog.set({main_screen: 1});

    this.props.onFetchData();
  }

  showTotalPriceByType = (trip) => {
    if(trip.trip_type === TRIP_TYPE.DELIVERY) return trip.total_price
    return trip.price
  }
  
  convert = (trip) => {
    if(trip.payment_method == PAYMENT_METHOD.PAYMENT_CASH || trip.payment_method == PAYMENT_METHOD.PAYMENT_CASH_HOST) {
      return formatVND(this.showTotalPriceByType(trip))
    } else {
      return Strings("notification.paid")
    }
  }

  render() {
    if (this.props.isLoading)
      return (<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Spinner isVisible={this.props.isLoading} type={'Circle'} color={Colors.colorPrimary} size={60} />
      </View>);

    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.dataSource}
          renderItem={({ item }) =>
            <ItemNotification
              navigation={this.props.navigation}
              price={this.convert(item)}
              data={item}
              type={this.props.type} 
            />
          }
          keyExtractor={item => item.id_trip}
          refreshing={this.props.isLoading}
          onRefresh={this.props.onFetchData}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: normalize(8)

  },
  itemContainer: {
    height: 78,
    alignContent: 'center',
    backgroundColor: Colors.colorWhite,
    flexDirection: 'row',
    marginTop: 12,
    marginHorizontal: 19,
    paddingVertical: 8,
    paddingHorizontal: 18
  }
});

export default CommonNotificationScreen;
