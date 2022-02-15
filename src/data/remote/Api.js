import { ApiHelper } from "./ApiHelper";
import { getApiUrl } from "../../utils/Utils";
import Constants from "../Constants";

export const fetchNotificationData = async (type) => {
  return ApiHelper.post(await getApiUrl(type));
};


export const requestAcceptBooking = (data) => {
  return ApiHelper.post(Constants.API_ACCEPT_BOOKING,
    {
      id_trip: data.id_trip,
      note_of_supplier: data.note_of_supplier,
      driverId: data.driverId,
      vehicleId: data.vehicleId
    });
};

export const reassignDriver = (data) => {
  return ApiHelper.post(Constants.API_REASSIGN_DRIVER,
    {
      tripId: data.id_trip,
      note_of_supplier: data.note_of_supplier,
      newDriverId: data.driverId,
      newVehicleId: data.vehicleId
    });
};

export const requestConfirmComplete = (data) => {
  return ApiHelper.post(Constants.API_COMPLETE_BOOKING,
    {
      id_trip: data.id_trip
    });
};

export const requestReadTrip = (data) => {
  return ApiHelper.post(Constants.API_READ_TRIP,
    {
      id_trip: data.id_trip,
      status_trip: data.status
    });
};

export const requestUpdateInformation = (payload) => {
  let { role, name, phoneNumber } = payload;
  let data = {
    name,
    phoneNumber
  };
  return ApiHelper.post(Constants.API_PATH_UPDATE_INFORMATION, data);
};

//driver
export const fetchListDriver = () => {
  return ApiHelper.post(Constants.GET_LIST_DRIVER);
};

export const requestAddDriver = (payload) => {
  console.log("requestAddDriver", payload)
  let { name, phoneNumber } = payload;
  let data = {
    name,
    phoneNumber
  };
  return ApiHelper.post(Constants.ADD_DRIVER, data);
};

export const requestUpdateDriver = (payload) => {
  let { driverId, name } = payload;
  let data = {
    driverId,
    name,
  };
  return ApiHelper.post(Constants.UPDATE_DRIVER, data);
};

export const requestDeleteDriver = (payload) => {
  let { driverId } = payload;
  let data = {
    driverId
  };
  return ApiHelper.post(Constants.DELETE_DRIVER, data);
};


//vehicle
export const fetchListVehicle = () => {
  return ApiHelper.post(Constants.GET_LIST_VEHICLE);
};

export const requestAddVehicle = (payload) => {
  let { type, detail, license } = payload;
  let data = {
    type,
    detail,
    license
  };
  return ApiHelper.post(Constants.ADD_VEHICLE, data);
};

export const requestUpdateVehicle = (payload) => {
  let { vehicleId, detail, license, type } = payload;
  let data = {
    vehicleId,
    detail,
    license,
    type
  };
  return ApiHelper.post(Constants.UPDATE_VEHICLE, data);
};

export const requestDeleteVehicle = (payload) => {
  let { vehicleId } = payload;
  let data = {
    vehicleId
  };
  return ApiHelper.post(Constants.DELETE_VEHICLE, data);
};

//api statistic
export const fetchDataChart = (payload) => {
  let data = {
    type_get: payload.type_get,
    number: payload.number
  };
  return ApiHelper.post(Constants.API_GET_DATA_CHART, data);
};

export const fetchListTripByTime = (payload) => {
  let data = {
    time_begin: payload.time_begin,
    time_end: payload.time_end,
    serial_before: payload.serial_before
  }
  return ApiHelper.post(Constants.API_GET_LIST_TRIP_BY_TIME, data);

}

//api debt
export const fetchCurrentDebt = () => {
  return ApiHelper.get(Constants.API_GET_CURRENT_DEBT);
}

export const fetchHistoryDebt = () => {
  return ApiHelper.get(Constants.API_GET_HISTORY_DEBT);
}

//profile
export const fetchInfoUser = () => {
  return ApiHelper.get(Constants.API_GET_PROFILE);
}

export const requestLogout = () => {
  return ApiHelper.post(Constants.API_SIGNOUT)
}
