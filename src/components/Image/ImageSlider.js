import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { normalize } from "../../utils/ViewUtils";
import Strings from "../../utils/LocalizationHelper";
import { connect } from "react-redux";
import { Overlay } from "react-native-elements";
import Ripple from 'react-native-material-ripple';
import GestureRecognizer, { swipeDirections } from 'react-native-swipe-gestures';
import Modal, { ModalContent } from 'react-native-modals';

const winWidth = Dimensions.get('window').width;
const winHeight = Dimensions.get('window').height;

const config = {
  velocityThreshold: 0.1,
  directionalOffsetThreshold: 40
};

class ImageSlider extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    }
  }

  updateState = (key, value) => {
    this.setState({
      [key]: value,
      isVisible: true
    })
  }

  hideView = () => {
    this.setState({
      isVisible: false
    }, () => this.props.onImageInvisible())
  }

  onSwipeUp = (gestureState) => {
    this.hideView()
  }

  onSwipeDown = (gestureState) => {
    this.hideView()
  }

  onSwipeLeft = (gestureState) => {
    console.log("onSwipeLeft")
  }

  onSwipeRight = (gestureState) => {
    console.log("onSwipeRight")
  }

  onSwipe = (gestureName, gestureState) => {
    const { SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT } = swipeDirections;
    this.setState({ gestureName: gestureName });
    switch (gestureName) {
      case SWIPE_UP:
        this.onSwipeUp()
        break;
      case SWIPE_DOWN:
        this.onSwipeDown()
        break;
      case SWIPE_LEFT:
        this.onSwipeLeft()
        break;
      case SWIPE_RIGHT:
        this.onSwipeRight()
        break;
    }
  }

  render() {
    let { isVisible } = this.state;
    if (!isVisible) return (
      null
    )
    return (
      <View style={styles.main}>
        <GestureRecognizer
          style={styles.content}
          onSwipe={(direction, state) => this.onSwipe(direction, state)}

        >

          <Ripple
            style={styles.close}
            onPress={() => {
              this.hideView()
            }}
          >
            <Text style={styles.closeText}>X</Text>
          </Ripple>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={{ uri: this.state.src }}
          />
        </GestureRecognizer>


      </View>
    )

  }
}

const styles = StyleSheet.create({
  main: {
    elevation: 10,
    position: "absolute",
    zIndex: 99999,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "#000",
    width: winWidth,
    height: winHeight,
  },
  modalContent: {
    width: 200,
    height: 200
  },
  content: {
    width: "100%",
    height: "100%",
  },
  close: {
    width: 30,
    height: 30,
    position: "absolute",
    zIndex: 1001,
    marginTop: 20,
    marginLeft: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    backgroundColor: "#d6d6d6"
  },
  closeText: {
    color: "#000",
    fontSize: normalize(12),
    fontWeight: "bold"
  },
  img: {
    flex: 1,
    height: undefined,
    width: undefined,
    alignSelf: 'stretch',
  },
  wrapImg: {
    position: "relative",
    width: winWidth,
    height: winHeight,
  }
});

export default ImageSlider;