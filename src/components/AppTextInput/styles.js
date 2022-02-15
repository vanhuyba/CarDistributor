import {Platform} from 'react-native';
import {StyleSheet} from "react-native";

import Colors from '../../assets/Colors';

export default StyleSheet.create({
    icon: {
        alignSelf: "center"
    },
    borderFocused: {
        borderColor: Colors.colorPrimary,
        borderBottomWidth: 2
    },
    borderNotFocus: {
        borderColor: Colors.colorLightGrey
    },
    borderNotFocusError: {
        borderColor: Colors.colorPrimary
    },
    inputGrp: {
        flexDirection: 'column',
        backgroundColor: Colors.colorLightGrey,
        marginBottom: 5
    },
    labelStyle: {
        color: Colors.colorBlack,
        alignSelf: "flex-start"
    },
    labelStyleError: {
        color: Colors.colorPrimary,
        fontWeight: "bold",
        alignSelf: "flex-start"
    },
    input: {
        color: '#000',
        paddingLeft: 0
    },
    form: {
        flex: 1,
        paddingLeft: 20,
        paddingRight: 20
    },
    formErrorIcon: {
        color: '#000',
        marginTop: 5,
        right: 10
    },
    formErrorText1: {
        fontWeight: "bold",
        color: Colors.colorPrimary,
        fontSize: 12,
        alignSelf: "center"
    },
    formErrorText2: {
        fontSize: Platform.OS === 'android' ? 12 : 15,
        color: 'transparent',
        textAlign: 'right',
        top: -10
    },
    errorContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        flex: 1
    }
});
