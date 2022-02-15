import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, Linking, Alert } from 'react-native';
import Colors from "../assets/Colors";
import { formatVND, standardizeDateStringLite, preFixSerial } from "../utils/Utils";
import Constants, { TRIP_STATUS, TRIP_TYPE, DELIVERY_TYPE, VEHICLE_TYPE } from "../data/Constants";
import Strings from "../utils/LocalizationHelper";
import { normalize } from "../utils/ViewUtils";
import renderIf from "../utils/RenderHelper";
import { Icon } from "react-native-elements";
import Ripple from 'react-native-material-ripple';
import { connect } from 'react-redux';
import { requestReadTrip } from "../screens/main/notification/NotificationAction"
import { InAppBrowser } from 'react-native-inappbrowser-reborn'

class ItemNotification extends PureComponent {
    itemIcon = (vehicleType, tripType) => {
        if (tripType === TRIP_TYPE.DELIVERY) {
            return require('../assets/icons/ic_delivery_512.png');
        } else if (tripType == TRIP_TYPE.CAR_RENTAL) {
            return require('../assets/icons/ic_car_rental.png');
        } else {
            switch (vehicleType) {
                case "hatchback":
                    return require('../assets/icons/ic_hatchback.png');
                case "sedan":
                    return require('../assets/icons/ic_sedan.png');
                case "suv":
                    return require('../assets/icons/ic_suv.png');
                case "minivan":
                    return require('../assets/icons/ic_minivan.png');
                default:
                    return require('../assets/icons/ic_luxcar.png');
            }
        }

    };

    itemIconText = (vehicleType, tripType) => {
        if (tripType === TRIP_TYPE.DELIVERY) {
            var numberItem = this.props.data.package_total;
            if (numberItem > 1) return `${numberItem} items`
            return `${numberItem} item`
        } else {
            switch (vehicleType) {
                case "hatchback":
                    return "hatchback";
                case "sedan":
                    return "3 " + Strings('notification.seats');
                case "suv":
                    return "5 " + Strings('notification.seats');
                case "minivan":
                    return "8 " + Strings('notification.seats');
                default:
                    return "premium"
            }
        }

    };

    tripStatus = (status, tripType, isSupplier, vehicleId) => {
        switch (status) {
            case TRIP_STATUS.ACCEPT:
                if(vehicleId) {
                    return Strings('notification.accept_status');
                } else {
                    return ""
                }
            case TRIP_STATUS.RIDING:
                if (tripType === TRIP_TYPE.DELIVERY) return Strings('notification.riding_status_de');
                return Strings('notification.riding_status_up');
            case TRIP_STATUS.UPDATE:
                // if Supplier, show accept
                if (isSupplier) return Strings('notification.accept_status');
                return ""
            default:
                return ""
        }
    }

    colorStatusTrip = (status) => {
        switch (status) {
            case TRIP_STATUS.RIDING:
                return "#43A047"
            default:
                return "#FF7900"
        }
    }

    timeValue = (data, type) => {
        // switch (type) {
        //     case Constants.BOOKING:
        //     case Constants.CONFIRM:
        return standardizeDateStringLite(data.time_leave);
        //     default:
        //         return standardizeDateStringLite(item.time_complete);
        // }
    };

    colorTimeIcon = (type) => {
        return type === Constants.COMPLETED ? '#3CFF00' : '#00B1FF'
    };

    nameTimeIcon = (type) => {
        return type === Constants.COMPLETED ? "check" : "clock-o"
    };
    async openLink() {
        try {
            const url = `https://tracking.upit.xyz/${this.props.data.id_trip}`
            if (await InAppBrowser.isAvailable()) {
                InAppBrowser.open(url, {
                    // iOS Properties
                    dismissButtonStyle: 'cancel',
                    preferredBarTintColor: Colors.colorPrimary,
                    preferredControlTintColor: 'white',
                    readerMode: false,
                    animated: true,
                    modalPresentationStyle: 'fullScreen',
                    modalTransitionStyle: 'coverVertical',
                    modalEnabled: true,
                    enableBarCollapsing: false,
                    // Android Properties
                    showTitle: true,
                    toolbarColor: Colors.colorPrimary,
                    secondaryToolbarColor: 'black',
                    enableUrlBarHiding: false,
                    enableDefaultShare: true,
                    forceCloseOnRedirection: false,
                    // Specify full animation resource identifier(package:anim/name)
                    // or only resource name(in case of animation bundled with app).
                    animations: {
                        startEnter: 'slide_in_right',
                        startExit: 'slide_out_left',
                        endEnter: 'slide_in_left',
                        endExit: 'slide_out_right'
                    },
                    headers: {}
                })
            } else {
                Linking.openURL(url)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    _onPress = () => {
        //if (this.props.data.vehicle_type === VEHICLE_TYPE.MINIVAN) {
            //test webview function in screen
        //    this.props.navigation.navigate('Tracking', { data: this.props.data });
        //} else {
            //test in app browser
        //    this.openLink();
        //}

        // main function
         const { data } = this.props
         if (data.trip_type === TRIP_TYPE.DELIVERY) {
             this.props.navigation.navigate('DeliveryDetail', {
                 type: this.props.type,
                 data,
             });
         } else {
             this.props.navigation.navigate('NotificationDetail', {
                 type: this.props.type,
                 data,
             });
         }
         if (this.props.type === Constants.BOOKING) {
             if(!data.is_readed) {
                 this.props.onRequestReadTrip(data);
             }
         }
    };


    _backgroundItem = (is_readed, type) => {
        if (type !== Constants.BOOKING) return styles.read;
        return is_readed ? styles.read : styles.unread;
    };

    render() {
        const { type, data, price } = this.props;
        return (
            <Ripple
                onPress={this._onPress}
                style={[styles.itemContainer, this._backgroundItem(data.is_readed, type)]}
            >

                <View style={{ alignItems: 'center', marginRight: normalize(10) }}>
                    <Image style={{ width: 38, height: 38, resizeMode: "contain" }} source={this.itemIcon(data.vehicle_type, data.trip_type)} />
                    <Text style={{
                        fontSize: normalize(9),
                        marginTop: normalize(4)
                    }}>{this.itemIconText(data.vehicle_type, data.trip_type)}</Text>
                </View>

                <View style={{ flex: 1, justifyContent: 'space-between', flexDirection: "row" }}>
                    <View style={{ flex: 2 }}>
                        <Text style={{ fontSize: normalize(9) }}>
                            {renderIf(data.status === TRIP_STATUS.UPDATE,
                                <Text style={{ color: Colors.colorLightBlue, fontWeight: 'bold' }}>{'[UPDATE] '}</Text>)}
                            <Text style={{ fontSize: normalize(12), color: "#000000" }}>{`${preFixSerial(data.trip_type, data.serial, data.appointment_serial)} - ${data.name_customer}`}</Text>
                        </Text>
                        <Text style={{ fontSize: normalize(10) }}>
                            <Text style={{ color: Colors.colorBlack }}>{data.name_leave + " "}</Text>
                            {
                                data.trip_type == TRIP_TYPE.CAR_RENTAL ? null :
                                    <>
                                        <Text>
                                            <Image style={{ width: 12, height: 12 }}
                                                source={require("../assets/icons/icon_to.png")}
                                            />
                                        </Text>
                                        <Text style={{ color: Colors.colorBlack }}>{" " + data.name_arrive}.</Text>
                                    </>
                            }

                        </Text>
                        {renderIf(data.note_of_salepoint, <Text style={{ color: '#989898', fontSize: normalize(9) }}>
                            {Strings('notification.title_note')}
                            <Text style={{ color: Colors.colorBlack, fontSize: normalize(10) }}>{data.note_of_salepoint}</Text>
                        </Text>)}
                    </View>

                    <View style={{ flex: 1, marginTop: normalize(6), alignItems: "flex-end" }}>
                        <Text style={{ fontSize: normalize(12), color: '#00B1FF' }}>
                            {price}
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            {/* With DELIVERY trip: time_leave: thời gian nhận đồ, time_arrive: thời gian trả đồ
                            With Upde trip: time_leave: thời gian đón khách
                        */}
                            <Text style={{ fontSize: normalize(9), color: '#000000', marginLeft: normalize(4) }}>{data.trip_type === TRIP_TYPE.DELIVERY ? data.delivery_type === DELIVERY_TYPE.DELIVERY_AIRPORT_TO_STATION ? data.time_leave : data.time_arrive : data.time_leave}</Text>
                        </View>
                        <Text style={{ fontSize: normalize(12), color: this.colorStatusTrip(data.status) }}>
                            {this.tripStatus(data.status, data.trip_type, Boolean(data.supplierId), Boolean(data.vehicle_id))}
                        </Text>
                    </View>
                </View>

            </Ripple>)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4'
    },
    itemContainer: {
        alignItems: "center",
        justifyContent: "center",
        alignContent: 'center',
        backgroundColor: Colors.colorWhite,
        flexDirection: 'row',
        marginVertical: normalize(5),
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        // elevation: 4,
        borderRadius: normalize(5),
        // shadowOffset: { width: 2, height: 2 },
        // shadowColor: "black",
        // shadowOpacity: 0.16,
        // shadowRadius: 2,
    },
    read: {
        backgroundColor: Colors.colorWhite,
    },
    unread: {
        backgroundColor: Colors.colorUnread,
    }
});

const mapDispatchToProps = (dispatch) => {
    return {
        onRequestReadTrip: (data) => {
            dispatch(requestReadTrip(data))
        },
    };
};

export default connect(null, mapDispatchToProps)(ItemNotification)