import {
  FETCH_DRIVER,
  FETCH_VEHICLE,
  ADD_DRIVER, DELETE_DRIVER, UPDATE_DRIVER,
  ADD_VEHICLE, DELETE_VEHICLE, UPDATE_VEHICLE
} from "./DriverAction";
import moment from "moment";
import Constants, { TRIP_STATUS } from "../../../data/Constants";

export const initialState = {
  driverList: [],
  isLoadingDriver: false,
  errorLoadingDriver: '',

  vehicleList: [],
  isLoadingVehicle: false,
  errorLoadingVehicle: '',

  isLoadingAddDriver: false,
  isUpdatingDriver: false,
  isLoadingDeleteDriver: false,

  isLoadingAddVehicle: false,
  isLoadingUpdateVehicle: false,
  isLoadingDeleteVehicle: false,

  vehicleTypeIndex: 0

};

export const driverReducer = (state = initialState, action = {}) => {
  console.log("driverReducer", action);
  switch (action.type) {
    // FETCH_DRIVER
    case FETCH_DRIVER.LOADING:
      return {
        ...state,
        isLoadingDriver: true
      };

    case FETCH_DRIVER.SUCCESS:
      return {
        ...state,
        driverList: action.payload,
        isLoadingDriver: false
      };

    case FETCH_DRIVER.ERROR:
      return {
        ...state,
        errorLoadingDriver: action.payload,
        isLoadingDriver: false
      };

    // FETCH_VEHICLE
    case FETCH_VEHICLE.LOADING:
      return {
        ...state,
        isLoadingVehicle: true
      };

    case FETCH_VEHICLE.SUCCESS:
      var list = action.payload;
      return {
        ...state,
        vehicleList: list,
        isLoadingVehicle: false
      };

    case FETCH_VEHICLE.ERROR:
      return {
        ...state,
        errorLoadingVehicle: action.payload,
        isLoadingVehicle: false
      };

    //Update vehicleList in local after request delete in Server success
    case Constants.REMOVE_VEHICLE_LOCAL:
      var list = action.payload;
      return {
        ...state,
        vehicleList: list,
        isLoadingVehicle: false
      };

    //Update driverList in local after request delete in Server success
    case Constants.REMOVE_DRIVER_LOCAL:
      return {
        ...state,
        driverList: action.payload,
      };

    // ADD, UPDATE, DELETE INFOR DRIVER/VEHICLE
    case ADD_DRIVER.LOADING:
      return {
        ...state,
        isLoadingAddDriver: true
      }
    case ADD_VEHICLE.LOADING:
      return {
        ...state,
        isLoadingAddVehicle: true
      }
    case DELETE_DRIVER.LOADING:
      return {
        ...state,
        isLoadingDeleteDriver: true
      }
    case DELETE_VEHICLE.LOADING:
      return {
        ...state,
        isLoadingDeleteVehicle: true
      }
    case UPDATE_DRIVER.LOADING:
      return {
        ...state,
        isUpdatingDriver: true
      }
    case UPDATE_VEHICLE.LOADING:
      return {
        ...state,
        isLoadingUpdateVehicle: true
      };
    case ADD_DRIVER.SUCCESS:
      return {
        ...state,
        driverList: [...state.driverList, action.payload],
        isLoadingAddDriver: false
      }
    case ADD_VEHICLE.SUCCESS:
      return {
        ...state,
        vehicleList: [...state.vehicleList, action.payload],
        isLoadingAddVehicle: false
      }
    case DELETE_DRIVER.SUCCESS:
      return {
        ...state,
        driverList: [...state.driverList.filter(item => item.id !== action.payload.driverId)],
        isLoadingDeleteDriver: false
      }
    case DELETE_VEHICLE.SUCCESS:
      return {
        ...state,
        vehicleList: [...state.vehicleList.filter(item => item.id !== action.payload.vehicleId)],
        isLoadingDeleteVehicle: false
      }
    case UPDATE_DRIVER.SUCCESS:
      var driverEditedIndex = state.driverList.findIndex(item => item.id === action.payload.driverId);
      var newDriverList = state.driverList;
      newDriverList[driverEditedIndex].name = action.payload.name
      return {
        ...state,
        driverList: [...newDriverList],
        isUpdatingDriver: false,
      }
    case UPDATE_VEHICLE.SUCCESS:
      var { vehicleId, detail, license, type } = action.payload;
      var vehicleEditedIndex = state.vehicleList.findIndex(item => item.id === vehicleId);
      var newVehicleList = state.vehicleList;
      //update propties
      newVehicleList[vehicleEditedIndex].type = type;
      newVehicleList[vehicleEditedIndex].license = license;
      newVehicleList[vehicleEditedIndex].detail = detail;
      return {
        ...state,
        vehicleList: [...newVehicleList],
        isLoadingUpdateVehicle: false,
      }
    case ADD_DRIVER.ERROR:
      return {
        ...state,
        isLoadingAddDriver: false
      }
    case ADD_VEHICLE.ERROR:
      return {
        ...state,
        isLoadingAddVehicle: false
      }
    case DELETE_DRIVER.ERROR:
      return {
        ...state,
        isLoadingDeleteDriver: false
      }
    case DELETE_VEHICLE.ERROR:
      return {
        ...state,
        isLoadingDeleteVehicle: false
      }
    case UPDATE_DRIVER.ERROR:
      return {
        ...state,
        isUpdatingDriver: false
      }
    case UPDATE_VEHICLE.ERROR:
      return {
        ...state,
        isLoadingUpdateVehicle: false,
      }
    case Constants.VEHICLE_TYPE_PICKER:
      return {
        ...state,
        vehicleTypeIndex: action.payload
      };
    default:
      return state;
  }
};
