import axios from "axios";
import Constants, { BASE_URL, HTTPStatus } from "../Constants";
import AsyncStorage from '@react-native-community/async-storage';
import StoreConstant from "../StoreConstant";
import NavigationService from "../../utils/NavigationService";
import Strings from "../../utils/LocalizationHelper";

/**
 * parse response
 */
function parseBody(response) {
  console.log("CheckResponse: ", response);
  const headerStatus = response.status;
  if (headerStatus >= 200 && headerStatus < 300) {
    return response.data.data;
  } else {
    return Promise.reject({ message: Strings("message.execute_err") });
  }

}


/**
 * axios instance
 */
let instance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  }
});

// request header
instance.interceptors.request.use(async (config) => {
  // Do something before request is sent
  let accessToken = await AsyncStorage.getItem(StoreConstant.TOKEN);
  if (accessToken) {
    config.headers = {
      ...config.headers,
      "access_token": accessToken
    };
  }

  console.log("Starting Request", config);
  return config;
}, error => {
  return Promise.reject(error);
});

// response parse
instance.interceptors.response.use((response) => {
  return parseBody(response);
}, error => {
  console.log("Error status", error.response);
  if (error.response) {
    if (error.response.status >= 500) {
      return Promise.reject({ message: Strings("message.server_err") });
    } else {
      if (error.response.status === HTTPStatus.UNAUTHORIZED) {
        if (error.response.config.url !== `${BASE_URL}${Constants.API_PATH_LOGIN}`) {
          // AsyncStorage.clear();
          AsyncStorage.multiRemove([StoreConstant.TOKEN, StoreConstant.NAME, StoreConstant.EMAIL, StoreConstant.IMAGE_URL, StoreConstant.PHONE_NUMBER]);

          NavigationService.navigate("Login");
          return Promise.reject({ message: Strings("message.token_expired") });
        }
        return Promise.reject({ message: Strings("message.login_fail") });
      } else {
        var message = error.response.data.message;
        if (message === undefined) message = Strings("message.execute_err")
        return Promise.reject({ message: message });
      }

    }

  } else {
    return Promise.reject({ message: Strings("message.nework_err") });
  }
});

export const ApiHelper = instance;
