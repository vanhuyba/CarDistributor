import Constants, { TRIP_STATUS, TRIP_TYPE, CAR_RENTAL_DURATION } from "../data/Constants";
import moment from "moment";
import "moment/min/locales";
import Strings from "./LocalizationHelper";
import ImagePicker from "react-native-image-picker";
import { AsyncStorage, Platform, PermissionsAndroid, Clipboard } from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import Toast from "react-native-simple-toast";

const PREFIX_TIME = "00:00";
const POSTFIX_TIME = "23:59"

export const formatVND = (x) => {
    if (x === undefined || x === "" || x === null) return "0 đ"
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".").concat(" đ");
};

export const vndStyle = (x) => {
    if (x === "" || x === undefined) return 0
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const getTitle = (type) => {
    console.log("getTitle", "Type: " + type);
    switch (type) {
        case Constants.BOOKING:
        case Constants.UPDATE:
            return Strings("header.booking_detail");

        case Constants.CONFIRM:
            return Strings("header.confirm_detail");

        default:
            return Strings("header.complete_detail");
    }
};

export const getDurationTextCarrental = (type) => {
    switch (type) {
        case CAR_RENTAL_DURATION.FIRST_HALF:
            return Strings("notification.car_rental_duration_first");
        case CAR_RENTAL_DURATION.SECOND_HALF:
            return Strings("notification.car_rental_duration_second");
        default:
            return Strings("notification.car_rental_duration_fullday");
    }
}

export const getApiUrl = async (type) => {
    switch (type) {
        case Constants.BOOKING:
            return Constants.API_GET_ALL_TRIP_CREATE;
        // return Constants.API_GET_ALL_TRIP_CREATE + token;
        case Constants.CONFIRM:
            return Constants.API_GET_ALL_TRIP_ACCEPT;
        // return Constants.API_GET_ALL_TRIP_ACCEPT + token;
        default:
            return Constants.API_GET_ALL_TRIP_COMPLETE;
        // return Constants.API_GET_ALL_TRIP_COMPLETE + token;
    }
};

export const getTextButtonNotificationDetail = (type, status, tripType, vehicleId) => {
    switch (type) {
        case Constants.BOOKING:
            //screen opened from notification in default case
            // ex: noti_change_driver v.v.
            if (status === TRIP_STATUS.ACCEPT && vehicleId) {
                return Strings("notification.complete"); //reassign driver
            }
            return Strings("notification.accept");
        case Constants.CONFIRM:
            if (status === TRIP_STATUS.RIDING) {
                if (tripType === TRIP_TYPE.DELIVERY) return Strings("notification.riding_status_de")
                return Strings("notification.riding_status_up")
            }
            return Strings("notification.complete");
        default:
            return Strings("notification.completed");
    }
};

export const standardizeDateString = (dateString) => {
    /*try {
      // const date = moment(dateString).locale("vi");
      const date = moment(dateString);
      // return date.format();
      // return date.format('MM/DD/YYYY hh:mm A');
      return date.format("dd - DD/MM/YYYY HH:mm");
    } catch (e) {
      return dateString;
    }*/

    return standardizeDateStringLite(dateString)
};

export const standardizeDateStringLite = (dateString) => {
    return dateString;
};

export const standardizeDateStringDetail = (dateString) => {
    return dateString;
    /*try {
        // const date = moment(dateString).locale("vi");
        const date = moment(dateString);
        // return date.format();
        return date.format("HH:mm DD/MM/YYYY ");
        // return date.format("HH:mm ") + "\n" + date.format("DD-MM-YYYY");
    } catch (e) {
        return dateString;
    }*/
};

export const getScreenByNotifyType = (notifyType) => {
    switch (notifyType) {
        // case Constants.NOTIFY_BOOK:
        //     return Constants.BOOKING;
        case Constants.NOTIFY_ACCEPT:
        case Constants.NOTIFY_RIDING:
        case Constants.NOTIFY_REMIND_COMPLETE:
            return Constants.CONFIRM;
        case Constants.NOTIFY_COMPLETE:
            return Constants.COMPLETED;
        case Constants.NOTIFY_BOOK:
            return Constants.BOOKING
        case Constants.NOTIFY_UPDATE:
            return Constants.UPDATE
        default:
            return "";
    }
};

export const getTitleByIndexTab = (index) => {
    switch (index) {
        case 0:
            return Strings("header.notification");
        case 1:
            return Strings("header.driver");
        case 2:
            return Strings("header.statistic");
        case 3:
            return Strings("header.profile");
        default:
            return "";
    }
};

export const getProfileTitleByIndex = (index) => {
    switch (index) {
        case 0:
            return Strings("header.update_information");
        case 1:
            return Strings("header.change_password");
        default:
            return "";
    }
};

export const parseTimeRange = (time) => {
    var date = new Date(time);
    var month = date.getMonth();
    var year = date.getFullYear();

    let firstDate = new Date(year, month - 1, 1).getDate();
    let lastDate = new Date(year, month + 1, 0).getDate();

    return {
        time_begin: `${month + 1}/${firstDate}/${year} ${PREFIX_TIME}`,
        time_end: `${month + 1}/${lastDate}/${year} ${POSTFIX_TIME}`,
    }
}

export function selectPhoto(callback = () => {
}, options = {}) {
    let defaultOptions = {
        title: 'Select image',
        noData: true,
        quality: 1.0,
        storageOptions: {
            skipBackup: true
        }
    };

    let _options = Object.assign({}, defaultOptions, options);

    ImagePicker.showImagePicker(_options, response => {
        console.log('Response = ', response);

        let success = false;
        let errorMsg = null;
        let result = { ...response };

        if (response.didCancel) {
            errorMsg = '';
            console.log(errorMsg);
        } else if (response.error) {
            console.log('ImagePicker Error: ', response.error);
            errorMsg = 'ImagePicker Error: ' + response.error;
        } else {
            success = true;
            let iosFileUri = '';
            let androidFileName = '';
            if (Platform.OS === 'ios') {
                iosFileUri = response.uri.substring(5, response.uri.length);
            } else {
                androidFileName = response.path;
            }
            result['upload_uri'] = Platform.OS === 'ios' ? iosFileUri : ("file://" + androidFileName);
        }
        callback({ result, success, errorMsg });
    });
}

export function isFunction(func) {
    return func && typeof func === 'function';
}

export const _isStorageGranted = async () => {
    if (Platform.OS === "ios") {
        return true;
    } else {
        return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    }
};

export const screenshots = async (viewShot) => {
    //Toast.show(Strings("message.screen_shot_saved"), Toast.LONG)
    let granted = await _isStorageGranted();
    if (granted) {
        viewShot.capture().then(uri => {
            CameraRoll.saveToCameraRoll(uri)
                .then(Toast.show(Strings("message.screen_shot_saved"), Toast.LONG))
                .catch(err => console.log("err:", err));
        }, error => console.error("Oops, snapshot failed", error));
    } else {

        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            null
        ).then(permissionResult => {
            if (permissionResult === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("request permission", "permission grant");
                viewShot.capture().then(uri => {
                    CameraRoll.saveToCameraRoll(uri)
                        .then(Toast.show(Strings("message.screen_shot_saved"), Toast.LONG))
                        .catch(err => console.log("err:", err));
                }, error => console.error("Oops, snapshot failed", error));
            } else {
                console.log("request permission", "permission denied");
            }
        })


    }
};

export const normalizeUndefinedStr = (str) => {
    if (str === undefined || str === null) return "";
    return str;
}

export const copyToClipboard = (copyContent) => {
    Clipboard.setString(copyContent);
    Toast.show(Strings("message.saved_to_clipboard"), Toast.SHORT);
}

export const search = (input, ...data) => {
    let dataAsStr = "";
    dataAsStr = data.join("").toLowerCase();
    return dataAsStr.includes(input.toLowerCase());

}

export const preFixSerial = (tripType, upSerial, appointmentSerial) => {
    if (tripType === TRIP_TYPE.DELIVERY) {
        if(typeof appointmentSerial === "undefined" ) {
            return "#DE" + upSerial
        } else {
            return "#ST" + appointmentSerial
        }
    } else if (tripType == TRIP_TYPE.CAR_RENTAL) {
        return "#CR" + upSerial
    } else {
        return "#UP" + upSerial
    }
}

export const countItem = (number, label) => {
    if (number <= 1) return `${number} ${label}`
    return `${number} ${label}s`
}
