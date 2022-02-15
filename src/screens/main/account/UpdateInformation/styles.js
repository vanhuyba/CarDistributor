import {Platform, StyleSheet} from 'react-native';
import Colors from "../../../../assets/Colors";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
    },
    labelStyle: {
        marginTop: 20,
        color: Colors.colorLightGrey,
        alignSelf: "flex-start"
    },
    changePassword: {
        fontSize: (Platform.OS === 'ios') ? 20 : 16,
        color: Colors.colorPrimary,
        fontWeight: "bold",
        marginTop: 15,
        marginBottom: 15
    },
    btnSave: {
        marginTop: 10
    },
    saveLabel: {
        fontWeight: "bold",
        color: Colors.colorWhite,
        fontSize: (Platform.OS === 'ios') ? 20 : 16
    },
    descriptionStyle: {
        color: Colors.colorLightGrey
    }
});

export default styles;
