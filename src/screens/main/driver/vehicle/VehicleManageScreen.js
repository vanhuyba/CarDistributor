import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, FlatList, View } from "react-native";
import { connect } from "react-redux";
import VehicleItem from "./VehicleItem"
import { fetchVehicle } from "../DriverAction";
import Spinner from 'react-native-spinkit';
import Colors from "../../../../assets/Colors";
import {TYPE_SCREEN} from "../../../../data/Constants";
import {normalize} from "../../../../utils/ViewUtils"
import Strings from "../../../../utils/LocalizationHelper";
import Ripple from 'react-native-material-ripple';

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

class VehicleManageScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: "Quản lý xe"
  });

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  componentDidMount() {
    this.props.onFetchData();
  }

  render() {
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
              <VehicleItem vehicle={item} navigation={this.props.navigation} />
            )}
            ListFooterComponent={() => {
              return <View style={{height: 100}}></View>
             }}
            keyExtractor={item => item.id}
            refreshing={this.props.isLoading}
            onRefresh={this.props.onFetchData}
          />
        </View>
          <Ripple style={styles.btnAdd} onPress={() => this.props.navigation.navigate("AddVehicleScreen", { type: TYPE_SCREEN.ADD })}>
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
  footer: {
    height: "auto",
    width: "100%",
    alignItems: "center"
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
    isLoading: state.driverReducer.isLoadingVehicle,
    error: state.driverReducer.errorLoadingVehicle,
    dataSource: state.driverReducer.vehicleList
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchData: () => {
      dispatch(fetchVehicle())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VehicleManageScreen);