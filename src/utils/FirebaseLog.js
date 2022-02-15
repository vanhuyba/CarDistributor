import firebase from "firebase"
import AsyncStorage from '@react-native-community/async-storage';
import StoreConstant from "../data/StoreConstant";

export const set = async (data) => {
  var id = await AsyncStorage.getItem(StoreConstant.TOKEN);
  console.log("FirebaseLog", id)
  if (Boolean(id)) {
    console.log("FirebaseLog set", id)
    var colection = id + "/"
    firebase.database().ref(colection).update(data).then((data) => {
      console.log('FirebaseLog success', data);
    }).catch((error) => {
      console.log('FirebaseLog error', error);
    });
  }

}