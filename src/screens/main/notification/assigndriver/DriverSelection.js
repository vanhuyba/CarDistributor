import React, { Component } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, FlatList } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { normalize } from "../../../../utils/ViewUtils";
import { search } from "../../../../utils/Utils";
import Ripple from 'react-native-material-ripple';
import ItemNotificationDetail from "../../../../components/ItemNotifyDetail";
import Colors from "../../../../assets/Colors";
import DriverItemSelection from "./DriverItemSelection"
import { connect } from "react-redux";
import SearchComponent from "../../../../components/SearchComponent"

class DriverSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSelectedId: this.props.navigation.state.params.driverId,
      searchStr: ""
    }
  }


  static navigationOptions = ({ navigation }) => {
    return {
      title: Strings("notification.select_driver")
    }
  };

  subMitDriver = (driver) => {
    this.setState({
      currentSelectedId: driver.id
    }, () => {
      this.props.navigation.goBack();
      this.props.navigation.state.params.onSelectedDriver({ driver });
    })

  }
  onSearch = (text) => {
    this.setState({
      searchStr: text
    })
  }

  render() {
    let {searchStr} = this.state;
    return (
      <View style={styles.list}>
        <SearchComponent
          onSearch={this.onSearch}
        />
        <FlatList
          data={this.props.driverList}
          renderItem={({ item }) => {
            if(search(searchStr, item.name, item.phoneNumber)){
              return (
                <DriverItemSelection
                  driver={item}
                  onClick={() => this.subMitDriver(item)}
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
    driverList: state.driverReducer.driverList,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DriverSelection)