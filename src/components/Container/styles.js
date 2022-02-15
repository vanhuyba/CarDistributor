import {Dimensions, StyleSheet} from "react-native";
import Colors from "../../assets/Colors";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: width,
        height: height,
        backgroundColor: Colors.colorWhite,
        padding: 10
    }
});

export default styles;
