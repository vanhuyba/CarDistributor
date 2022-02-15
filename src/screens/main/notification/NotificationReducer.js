import {
  ADD_BOOKING, ADD_COMPLETE, ADD_CONFIRM, ADD_UPDATE,
  FETCH_BOOKING,
  FETCH_COMPLETED,
  FETCH_CONFIRM,
  REQUEST_ACCEPT_BOOKING, REQUEST_REASSIGN_DRIVER,
  REQUEST_CONFIRM_COMPLETE, REQUEST_READ_TRIP, RESET_DETAIL_ERROR, RESET_DETAIL_LOADING_STATE
} from "./NotificationAction";
import moment from "moment";
import Constants, { TRIP_STATUS } from "../../../data/Constants";
import Toast from "react-native-simple-toast";
import PushNotificationIOS from "@react-native-community/push-notification-ios";

export const initialState = {
  bookingList: [],
  isLoadingBooking: false,
  errorBooking: '',

  confirmList: [],
  isLoadingConfirm: false,
  errorConfirm: '',

  completedList: [],
  isLoadingCompleted: false,
  errorCompleted: '',

  isLoadingRequest: false,
  errorRequest: '',

  isLoadingCommon: false,
  commonMessage: '',

  driverIndex: 0,
  vehicleIndex: 0,

  isLoadingAssignDriver: false,
  isLoadingReassingDriver: false,

};

export const notificationReducer = (state = initialState, action = {}) => {
  console.log("notificationReducer", action);
  switch (action.type) {
    // [START] From Notification
    case ADD_BOOKING:
      if (state.bookingList.findIndex(item => item.id_trip === action.payload.id_trip) !== -1) {
        return {
          ...state,
          isLoadingRequest: false,
        };
      }
      return {
        ...state,
        isLoadingRequest: false,
        // Add to BookingList
        bookingList: [
          action.payload,
          ...state.bookingList,
        ]
      };

    case ADD_CONFIRM:
      console.log("ADD_CONFIRM")
      if (state.confirmList.findIndex(item => item.id_trip === action.payload.id_trip) !== -1) {
        return {
          ...state,
          isLoadingRequest: false,
        };
      }
      return {
        ...state,
        isLoadingRequest: false,
        //remove from bookingList
        bookingList: state.bookingList.filter(item => item.id_trip !== action.payload.id_trip),
        confirmList: [
          action.payload,
          ...state.confirmList,
        ]
      };

    case ADD_COMPLETE:
      if (state.completedList.findIndex(item => item.id_trip === action.payload.id_trip) !== -1) {
        return {
          ...state,
          //remove from confirmList
          confirmList: state.confirmList.filter(item => item.id_trip !== action.payload.id_trip),
          isLoadingRequest: false,
        };
      }

      return {
        ...state,
        isLoadingRequest: false,
        confirmList: state.confirmList.filter(item => item.id_trip !== action.payload.id_trip),
        // Add to completed List
        completedList: [
          action.payload,
          ...state.completedList,
        ]
      };

    case ADD_UPDATE:

      let updatedTrip = action.payload;
      if (!Boolean(updatedTrip.supplierId)) {
        let bookingList = state.bookingList.filter((item) => item.id_trip !== updatedTrip.id_trip);
        bookingList = [
          updatedTrip,
          ...bookingList
        ];
        return {
          ...state,
          isLoadingRequest: false,
          bookingList: bookingList,
        };
      } else {
        let acceptList = state.confirmList.filter((item) => item.id_trip !== updatedTrip.id_trip);
        acceptList = [
          updatedTrip,
          ...acceptList
        ];
        return {
          ...state,
          isLoadingRequest: false,
          confirmList: acceptList,
        };
      }
    // let bookingList = state.bookingList.filter((item) => item.id_trip !== action.payload.id_trip);
    // let acceptList = state.confirmList.filter((item) => item.id_trip !== action.payload.id_trip);

    // bookingList = [
    //   action.payload,
    //   ...bookingList
    // ];

    // return {
    //   ...state,
    //   isLoadingRequest: false,
    //   bookingList: bookingList,
    //   acceptList: acceptList
    // };
    // [END] From Notification

    // FETCH_BOOKING
    case FETCH_BOOKING.LOADING:
      return {
        ...state,
        isLoadingBooking: true
      };

    case FETCH_BOOKING.SUCCESS:
      var badgeCount = action.payload.length;
      if (Platform.OS === "ios") {
        PushNotificationIOS.setApplicationIconBadgeNumber(badgeCount);
      }
      return {
        ...state,
        bookingList: action.payload,
        isLoadingBooking: false
      };

    case FETCH_BOOKING.ERROR:
      return {
        ...state,
        errorBooking: action.payload,
        isLoadingBooking: false
      };

    // FETCH_CONFIRM
    case FETCH_CONFIRM.LOADING:
      return {
        ...state,
        isLoadingConfirm: true
      };

    case FETCH_CONFIRM.SUCCESS:
      return {
        ...state,
        confirmList: action.payload,
        isLoadingConfirm: false
      };

    case FETCH_CONFIRM.ERROR:
      return {
        ...state,
        errorConfirm: action.payload,
        isLoadingConfirm: false
      };

    // FETCH_COMPLETED
    case FETCH_COMPLETED.LOADING:
      return {
        ...state,
        isLoadingCompleted: true
      };

    case FETCH_COMPLETED.SUCCESS:
      return {
        ...state,
        completedList: action.payload,
        isLoadingCompleted: false
      };

    case FETCH_COMPLETED.ERROR:
      return {
        ...state,
        errorCompleted: action.payload,
        isLoadingCompleted: false
      };

    //reset commonMessage
    case Constants.RESET_COMMON_MESSAGE:
      return {
        ...state,
        commonMessage: "",
      }

    case REQUEST_ACCEPT_BOOKING.LOADING:
      return { ...state, isLoadingAssignDriver: true }

    case REQUEST_REASSIGN_DRIVER.LOADING:
      return { ...state, isLoadingReassingDriver: true, };

    case REQUEST_ACCEPT_BOOKING.SUCCESS:
      console.log("REQUEST_ACCEPT_BOOKING_SUCCESS ", action.payload);
      if (Platform.OS === "ios") {
        PushNotificationIOS.getApplicationIconBadgeNumber((num) => {
          if (num >= 1) {
            PushNotificationIOS.setApplicationIconBadgeNumber(num - 1);
          }
        });
      }
      return {
        ...state,
        isLoadingAssignDriver: false,
        // Delete from BookingList
        bookingList: state.bookingList.filter(item => item.id_trip !== action.payload.id_trip),
        // Add to ConfirmList
        confirmList: [
          action.payload,
          ...state.confirmList
        ]
      };

    case REQUEST_REASSIGN_DRIVER.SUCCESS:
      // Update trip from confirmList after reassign driver
      let confirmList = state.confirmList;
      let indexTrip = confirmList.findIndex(item => item.id_trip === action.payload.id_trip)

      confirmList[indexTrip].vehicle_id = action.payload.vehicleId;
      confirmList[indexTrip].vehicle_license = action.payload.vehicle_license;
      confirmList[indexTrip].vehicle_detail = action.payload.vehicle_detail;
      confirmList[indexTrip].driver.id = action.payload.driverId;
      confirmList[indexTrip].driver.name = action.payload.driver_name;
      confirmList[indexTrip].driver.phoneNumber = action.payload.driver_phoneNumber;
      // confirmList[indexTrip].driver_id = action.payload.driverId; 
      // confirmList[indexTrip].driver_name = action.payload.driver_name; 
      // confirmList[indexTrip].driver_phoneNumber = action.payload.driver_phoneNumber;  
      confirmList[indexTrip].note_of_supplier = action.payload.note_of_supplier;
      return {
        ...state,
        isLoadingReassingDriver: false,
      };

    case REQUEST_ACCEPT_BOOKING.ERROR:
      return { ...state, isLoadingAssignDriver: false, };

    case REQUEST_REASSIGN_DRIVER.ERROR:
      return { ...state, isLoadingReassingDriver: false, };

    case REQUEST_CONFIRM_COMPLETE.LOADING:
      return { ...state, isLoadingRequest: true, };

    case REQUEST_CONFIRM_COMPLETE.SUCCESS:
      return {
        ...state,
        isLoadingRequest: false,
        // Delete from ConfirmList
        confirmList: state.confirmList.filter(item => item.id_trip !== action.payload.id_trip),
        // Add to completedList
        completedList: [
          {
            ...action.payload,
            status: TRIP_STATUS.COMPLETE,
            time_complete: moment(new Date()).format('hh:mm - MM/DD/YYYY') //this local timestamp, not server response
          },
          ...state.completedList,
        ]
      };
    case REQUEST_CONFIRM_COMPLETE.ERROR:
      return { ...state, isLoadingRequest: false, };

    case RESET_DETAIL_LOADING_STATE:
      return {
        ...state, isLoadingRequest: false,
        errorRequest: action.payload,
      };

    case RESET_DETAIL_ERROR:
      return { ...state, isLoadingRequest: false, errorRequest: '' };


    case REQUEST_READ_TRIP.SUCCESS:
      let newBookings = state.bookingList.map(book => (
        book.id_trip === action.payload.id_trip ? { ...book, is_readed: true } : book
      ));

      return {
        ...state,
        bookingList: newBookings
      };

    //auto to fill suggest vehicle by driver
    case Constants.DRIVER_PICKER:
      if (state.driverList.length > 0) {
        var driver = state.driverList[action.payload];
        var vehicle_Index = 0;
        if (driver.vehicleId !== undefined) {
          var vehicle_Index = state.vehicleList.findIndex(item => item.id === driver.vehicleId);
          if (vehicle_Index === -1) subIndex = 0;
        }

        return {
          ...state,
          driverIndex: action.payload,
          vehicleIndex: vehicle_Index
        };
      }
      return {
        ...state,
        driverIndex: action.payload,
      };


    case Constants.VEHICLE_PICKER:
      return {
        ...state,
        vehicleIndex: action.payload
      };


    default:
      return state;
  }
};
