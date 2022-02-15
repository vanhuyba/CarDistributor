import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { normalize } from "../../../../utils/ViewUtils";
import { search } from "../../../../utils/Utils";
import Ripple from 'react-native-material-ripple';
import ItemNotificationDetail from "../../../../components/ItemNotifyDetail";
import Colors from "../../../../assets/Colors";
import VehicleItemSelection from "./VehicleItemSelection"
import { connect } from "react-redux";
import SearchComponent from "../../../../components/SearchComponent"

class VehicleSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedId: this.props.navigation.state.params.vehicleId,
      searchStr: ""
    }
  }


  static navigationOptions = ({ navigation }) => {
    return {
      title: Strings("notification.select_vehicle")
    }
  };


  subMitVehicle = (vehicle) => {
    this.setState({
      currentSelectedId: vehicle.id
    }, () => {
      this.props.navigation.goBack();
      this.props.navigation.state.params.onSelectedVehicle({ vehicle });
    })

  }

  onSearch = (text) => {
    this.setState({
      searchStr: text
    })
  }

  render() {
    let { searchStr } = this.state;

    return (
      <View style={styles.list}>
        <SearchComponent
          onSearch={this.onSearch}
        />
        <FlatList
          data={this.props.vehicleList}
          renderItem={({ item }) => {
            if (search(searchStr, item.detail, item.license, item.type)) {
              return (
                <VehicleItemSelection
                  vehicle={item}
                  onClick={() => this.subMitVehicle(item)}
                  selected={item.id === this.state.currentSelectedId}
                />
              )
            }
          }}
          keyExtractor={item => item.id}
        />
      </View>

    )
  }

}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    marginBottom: normalize(20),
    borderBottomColor: "#d6d6d6",
    borderBottomWidth: 1,
    marginHorizontal: normalize(16)
  },
})

const mapStateToProps = (state) => {
  return {
    vehicleList: state.driverReducer.vehicleList,
  };
};


export default connect(mapStateToProps, null)(VehicleSelection)