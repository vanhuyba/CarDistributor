import React, { PureComponent } from "react";
import { StyleSheet, Text, View, TextInput, Image } from "react-native";
import { normalize } from "../utils/ViewUtils";
import Colors from "../assets/Colors";
import Strings from "../utils/LocalizationHelper";
import IconSearch from "../assets/icons/ic_search.png"

export default class SearchComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isFocus: false,
      text: ""
    }
  }

  onChangeText = text => {
    console.log("Search", text)
    this.setState({
      text: text
    })
    this.props.onSearch(text);
  }

  onBlur = () => {
    this.setState({
      isFocus: false
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {
          !this.state.isFocus && this.state.text === "" ?
            <Image
              style={styles.icon} source={IconSearch}
            />
            :
            null
        }
        <TextInput
          onFocus={() => this.setState({ isFocus: true })}
          onBlur={() => this.onBlur()}
          placeholderTextColor="rgba(60, 60, 67, 0.6)"
          style={styles.input}
          placeholder={Strings("label.search")}
          maxLength={200}
          onChangeText={(text) => this.onChangeText(text)}
        />
      </View>
    );
  }
}

SearchComponent.defaultProps = {
}

const styles = StyleSheet.create({
  container: {
    marginVertical: normalize(8),
    width: "100%",
    height: "auto",
    backgroundColor: "rgba(118, 118, 128, 0.12)",
    borderRadius: 8,
    flexDirection: "row",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center"

  },
  input: {
    flex: 1,
    height: 40,
    color: "rgba(60, 60, 67, 0.6)"
  },
  icon: {
    width: 30,
    height: 30,
    marginLeft: normalize(8),
  }
});

