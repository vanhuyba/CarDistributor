import React, { Component } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import ItemDebt from "./ItemDebt";
import { connect } from "react-redux";
import { fetchHistoryDebt } from "../AccountAction";
import Colors from "../../../../assets/Colors";
import Spinner from 'react-native-spinkit';

class DebtHistory extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: Strings("header.history_dept")
    };
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //this.props.onFetchHistoryDebt()
  }

  render() {
    const historyDebt = this.props.historyDebt
    return (
      <View style={styles.main}>
        <ScrollView style={styles.main}>
          {
            historyDebt.map((item, key) => {
              return (
                <ItemDebt
                  from_time={item.from_time}
                  status={item.status.toLowerCase()}
                  moneyKeeped={item.moneyKeeped}
                  debt={item.amount}
                  {...this.props}
                />
              )
            })
          }
        </ScrollView>
        {
          historyDebt.length === 0 ? (
            <Text style={styles.empty}>{Strings("message.debt_empty")}</Text>
          ) : null
        }
        
      </View>

    )
  }

}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    textAlign: "center",
    alignItems: "center",
  },
  wrapSpiner: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center"
  },
  main: {
    flex: 1
  },
})


const mapStateToProps = (state) => {
  return {
    historyDebt: state.accountReducer.historyDebt,
    isLoadingHistoryDebt: state.accountReducer.isLoadingHistoryDebt
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onFetchHistoryDebt: () => {
      dispatch(fetchHistoryDebt())
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DebtHistory)