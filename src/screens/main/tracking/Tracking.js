import React from 'react';
import { WebView } from 'react-native-webview';
import Strings from "../../../utils/LocalizationHelper";

export default function Tracking(props) {

  const { data } = props.navigation.state.params;
  const uri = `https://tracking.upit.xyz/${data.id_trip}`
  return <WebView
    source={{ uri: uri }}
  />;
}

Tracking.navigationOptions = ({ navigation }) => ({
  title: Strings("tab.tracking")
});