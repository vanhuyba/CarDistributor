const DOMAIN = "https://server.upit.asia/api/";
// const DOMAIN = "http://107.113.194.139:3200/api/";

const ROLE = "suppliers";
const ROLE_DEBT = "deptqueues";

const Constants = {

  API_SIGNOUT: `${ROLE}/signout`,
  API_PATH_LOGIN: `${ROLE}/signin`,
  API_GET_PROFILE: `${ROLE}/getInfo`,
  API_GET_ALL_TRIP_CREATE: `${ROLE}/getAllTripCreate`,
  API_GET_ALL_TRIP_ACCEPT: `${ROLE}/getAllTripAccept`,
  API_GET_ALL_TRIP_COMPLETE: `${ROLE}/getAllTripComplete`,

  API_ACCEPT_BOOKING: `${ROLE}/acceptBook`,
  API_COMPLETE_BOOKING: `${ROLE}/confirmCompleteBook`,

  API_READ_TRIP: `${ROLE}/readStatusTrip`,

  API_PATH_UPDATE_INFORMATION: `${ROLE}/editInfo`,
  API_PATH_CHANGE_PASSWORD: `${ROLE}/changepassword`,
  API_PATH_RESET_PASSWORD: `${ROLE}/forgetPassword`,
  API_PATH_UPDATE_IMAGE: `${ROLE}/updateAvatar`,

  BOOKING: "UPDE_Booking",
  UPDATE: "UPDE_UPDATE",
  CONFIRM: "UPDE_Confirm",
  COMPLETED: "UPDE_Completed",

  NOTIFY_BOOK: 'notify_book',
  NOTIFY_ACCEPT: 'notify_accept',
  NOTIFY_COMPLETE: 'notify_complete',
  NOTIFY_UPDATE: 'notify_update',
  NOTIFY_READED: 'notify_readed',
  NOTIFY_RIDING: 'notify_confirm_riding',
  NOTIFY_REMIND_COMPLETE: 'notify_remind_supplier_complete_trip',

  DEFAULT_IMAGE_URL: "https://cdn.iconscout.com/icon/premium/png-256-thumb/female-avatar-12-774634.png",

  //driver
  ADD_DRIVER: `${ROLE}/addDriver`,
  DELETE_DRIVER: `${ROLE}/deleteDriver`,
  UPDATE_DRIVER: `${ROLE}/editInfoDriver`,

  ADD_VEHICLE: `${ROLE}/addVehicle`,
  DELETE_VEHICLE: `${ROLE}/deleteVehicle`,
  UPDATE_VEHICLE: `${ROLE}/editInfoVehicle`,

  GET_LIST_DRIVER: `${ROLE}/getListDriverOfSupplier`,
  GET_LIST_VEHICLE: `${ROLE}/getListVehicleOfSupplier`,

  API_REASSIGN_DRIVER: `${ROLE}/updateInfoTripBySupplier`,

  MESSAGE_DELETE_SUCCESS: "MESSAGE_DELETE_SUCCESS",
  MESSAGE_UPDATE_SUCCESS: "MESSAGE_UPDATE_SUCCESS",
  MESSAGE_ADD_SUCCESS: "MESSAGE_ADD_SUCCESS",
  MESSAGE_FAIL: "FAIL",

  RESET_COMMON_MESSAGE: "RESET_COMMON_MESSAGE",

  REMOVE_VEHICLE_LOCAL: "REMOVE_VEHICLE_LOCAL",
  REMOVE_DRIVER_LOCAL: "REMOVE_DRIVER_LOCAL",
  UPDATE_VEHICLE_LOCAL: "UPDATE_VEHICLE_LOCAL",
  UPDATE_DRIVER_LOCAL: "UPDATE_DRIVER_LOCAL",
  PAYMENT_CASH: "cash",
  PAYMENT_ONLINE: "pay_online",
  PAYMENT_DEBT: "debt",

  //salepoint api for statitics
  API_GET_DATA_CHART: `${ROLE}/getAllPrice`,
  API_GET_LIST_TRIP_BY_TIME: `${ROLE}/getAllTripCompleteByTime`,

  //api debt
  API_GET_CURRENT_DEBT: `${ROLE_DEBT}/currentDeptSupplier`,
  API_GET_HISTORY_DEBT: `${ROLE_DEBT}/listdeptSupplier`,

  DRIVER_PICKER: "DRIVER_PICKER",
  DRIVER_PICKER_SEDAN: "DRIVER_PICKER_SEDAN",
  DRIVER_PICKER_SUV: "DRIVER_PICKER_SUV",
  DRIVER_PICKER_MINIVAN: "DRIVER_PICKER_MINIVAN",
  VEHICLE_PICKER: "VEHICLE_PICKER",
  SEDAN_PICKER: "SEDAN_PICKER",
  SUV_PICKER: "SUV_PICKER",
  MINIVAN_PICKER: "MINIVAN_PICKER",
  VEHICLE_TYPE_PICKER: "VEHICLE_TYPE_PICKER",
  SEDAN: "sedan",
  SUV: "suv",
  MINIVAN: "minivan",

};

export const HTTPStatus = {
  UNAUTHORIZED: 401
};
export const BASE_URL = `${DOMAIN}`;

export const API_GET_IMAGE_URL = (imageName) => `${DOMAIN}image/${ROLE}/${imageName}`;

export const TYPE_SCREEN = {
  ADD: "add",
  UPDATE: "edit"
}

export const TRIP_STATUS = {
  CREATE: "create",
  UPDATE: "update",
  ACCEPT: "accept",
  RIDING: "riding",
  COMPLETE: "complete",
}

export const VERSION = {

  // //dev
  // ANDROID: "2.0.0.02",
  // IOS: "6.0.0.02",

  // //uat
  // ANDROID: "2.1.0.02",
  // IOS: "6.1.0.02",

  //release
  ANDROID: "2.2.6.3",
  IOS: "6.2.26"
}

export const TRIP_TYPE = {
  UPDE: "UP",
  DELIVERY: "DE",
  CAR_RENTAL: "CR"
}

export const CAR_RENTAL_DURATION = {
  FIRST_HALF: "first_half",
  SECOND_HALF: "second_half",
  FULL_DAY: "one_day"
}

export const DELIVERY_TYPE = {
  DELIVERY_AIRPORT_TO_STATION: 'delivery_airport_to_station',
  DELIVERY_STATION_TO_AIRPORT: 'delivery_station_to_airport'
}

export const FIREBASE_DB_CONFIG = {
  apiKey: "AIzaSyDWm7VXyRAj5f1TPSiE5eXgpWZtJNGS7XA",
  authDomain: "host-notification.firebaseapp.com",
  databaseURL: "https://host-notification.firebaseio.com",
  projectId: "host-notification",
  storageBucket: "host-notification.appspot.com",
  messagingSenderId: "535076973852",
  appId: "1:535076973852:web:a26f2a086c27e6dc98ded9",
  measurementId: "G-PQ2FMXN860"
};
export const PAYMENT_METHOD = {
  PAYMENT_CASH: "cash",
  PAYMENT_ONLINE: "pay_online",
  PAYMENT_DEBT: "debt",
  PAYMENT_CASH_HOST: "cash_by_host"
}
export const CHART_PAGE_SIZE = 20;
export const VEHICLE_TYPE = {
  HATCHBACK: 'hatchback',
  SEDAN: 'sedan',
  SUV: 'suv',
  MINIVAN: 'minivan'
};
export default Constants;
