import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, FlatList, View } from "react-native";
import { connect } from "react-redux";
import DriverItem from "./DriverItem"
import { fetchDriver, requestAddDriver } from "../DriverAction";
import Spinner from 'react-native-spinkit';
import Colors from "../../../../assets/Colors";
import { TYPE_SCREEN } from "../../../../data/Constants";
import { normalize } from "../../../../utils/ViewUtils"
import Strings from "../../../../utils/LocalizationHelper";
import Ripple from 'react-native-material-ripple';


class DriverManageScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Quản lý tài xế"
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    //console.warn(this.props.navigation.state.routes[navigation.state.index].routeName,this.props.navigation.state.routes[1].routeName);

    //this.props.navigation.navigate('VehicleManageScreen');
    this.props.onFetchData();
  }

  render() {
    console.log("DriverManageScreen", this.props.isLoading, this.props.dataSource)
    if (this.props.isLoading)
      return (<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Spinner isVisible={this.props.isLoading} type={'Circle'} color={Colors.colorPrimary} size={60} />
      </View>);

    return (
      <View style={styles.container}>
        <View style={styles.list}>
          <FlatList
            data={this.props.dataSource}
            renderItem={({ item }) => (
              <DriverItem driver={item} navigation={this.props.navigation} />
            )}
            keyExtractor={item => item.id}
            refreshing={this.props.isLoading}
            onRefresh={this.props.onFetchData}
            ListFooterComponent={() => {
             return <View style={{height: 100}}></View>
            }}
          />
        </View>
        <Ripple style={styles.btnAdd} onPress={() => this.props.navigation.navigate("AddDriverScreen", { type: TYPE_SCREEN.ADD })}>
          <Image source={require('../../../../assets/icons/ic_add.png')} />
        </Ripple>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,

  },
  addNew: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "700"
  },

  btnAdd: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FF7900",
  }
});

const mapStateToProps = (state) => {
  return {
    isLoading: state.driverReducer.isLoadingDriver,
    error: state.driverReducer.errorLoadingDriver,
    dataSource: state.driverReducer.driverList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchData: () => {
      dispatch(fetchDriver())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverManageScreen);