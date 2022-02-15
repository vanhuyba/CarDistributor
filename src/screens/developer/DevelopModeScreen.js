import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import StoreConstant from '../../data/StoreConstant'
import AsyncStorage from '@react-native-community/async-storage';
import { Divider } from "react-native-elements";
import { copyToClipboard } from "../../utils/Utils"
import { firebase } from '@react-native-firebase/messaging';


class DevelopModeScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: "Developer options"
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      firebase_token: "",
      user_token: ""
    }
  }

  async componentDidMount() {
    let firebase_token = await AsyncStorage.getItem(StoreConstant.FIREBASE_TOKEN);
    let user_token = await AsyncStorage.getItem(StoreConstant.TOKEN);

    this.setState({
      firebase_token,
      user_token
    })
  }

  render() {
    let { firebase_token, user_token } = this.state;
    return (
      <View style={styles.main}>
        <View style={styles.row}>
          <Text>Firebase Token: </Text>
          <Text
            onPress={() => copyToClipboard(firebase_token)}
          >{firebase_token}</Text>
        </View>
        <Divider />
        <View style={styles.row}>
          <Text>User Token: </Text>
          <Text
            onPress={() => copyToClipboard(user_token)}
          >{user_token}</Text>
        </View>
        <View style={styles.row}>
          <Text>Badge number: </Text>
          <Text
            onPress={() => copyToClipboard(firebase.messaging().badge)}
          >{firebase.messaging().badge}</Text>
        </View>
      </View>

    )
  }

}

const styles = StyleSheet.create({
  row: {
    marginVertical: 8,
  },
  main: {
    flex: 1
  },
})

export default DevelopModeScreen