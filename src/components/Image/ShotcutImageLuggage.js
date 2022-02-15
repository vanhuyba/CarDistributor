import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { normalize } from "../../utils/ViewUtils";
import Strings from "../../utils/LocalizationHelper";
import Toast from "react-native-simple-toast";
import Ripple from 'react-native-material-ripple';

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;


class ShotcutImageLuggage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isErr: false
    }
  }

  onError = () => {
    this.setState({
      isErr: true
    })
  }

  onOpenImage = () => {
    const { isErr } = this.state;
    if (isErr) {
      Toast.show(Strings("message.load_image_err"), Toast.LONG)
    } else {
      this.props.onOpenImage()
    }
  }


  render() {
    const { isErr } = this.state;
    return (
      <Ripple style={styles.main}
        onPress={() => this.onOpenImage()}
      >
        {
          isErr ?
            <View>
              <Image
                onError={() => this.onError()}
                style={styles.itemImageErr}
                source={require("../../assets/icons/ic_app_login.png")}
              />
              <View style={styles.dim}></View>
            </View> :
            <Image
              onError={() => this.onError()}
              style={styles.itemImage}
              source={{ uri: this.props.uri }}
            />
        }

      </Ripple>
    )
  }

}

const styles = StyleSheet.create({
  main: {
    marginLeft: normalize(12),
    borderColor: "#d6d6d6",
    borderWidth: 0.5,
  },
  itemImage: {
    width: normalize(70),
    height: normalize(70),
  },
  itemImageErr: {
    padding: 8,
    resizeMode: "center",
    width: normalize(70),
    height: normalize(70),
  },
  dim: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.6,
    backgroundColor: "#000000"
  }

});

export default ShotcutImageLuggage;