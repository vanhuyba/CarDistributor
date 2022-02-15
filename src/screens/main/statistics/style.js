
import { StyleSheet } from "react-native";
import {normalize} from "../../../utils/ViewUtils"

export default styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  main: {
    paddingLeft: 0,
    paddingRight: 0,
    minHeight: "100%",
    backgroundColor: '#f4f4f4'
  },
  wrapChart: {
    marginBottom: normalize(20),
  },
  wrapList: {
    paddingLeft: normalize(8),
    paddingRight: normalize(8),
    // backgroundColor: "#FFFFFF",
    marginTop: normalize(20),
    flex: 1,
  },
  spiner: {
    alignItems: "center",
    position: "absolute",
    justifyContent: "center",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  spinerLoadMore: {
    flex: 1,
    height: "100%",
    backgroundColor: "#d6d6d6",
    opacity: 0.5,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center"
  },
})
