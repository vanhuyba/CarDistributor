import React, { Component } from "react";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Picker, ActionSheetIOS } from "react-native";
import { normalize } from "../../utils/ViewUtils"
import Toast from "react-native-simple-toast";
import Strings from "../../utils/LocalizationHelper";

class UpdePicker extends Component {
    constructor(props) {
        super(props);
    }

    showActionSheet = () => {
        var { options, title, cancelIndex, type } = this.props;
        var self = this;
        if (options.length === 0) {
            Toast.show(Strings("message.empty_item"), Toast.LONG);
            return;

        }
        ActionSheetIOS.showActionSheetWithOptions({
            options: options,
            title: title,
            cancelButtonIndex: cancelIndex,
            destructiveButtonIndex: this.props.value,
        },
            (buttonIndex) => {
                if (buttonIndex === cancelIndex) {
                    return;
                }
                this.props.callParentMethod(type, buttonIndex);

            });
    }

    render() {
        var { options, cancelIndex, type } = this.props;

        return (
            <View style={styles.container}>

                {Platform.select({
                    ios: (


                        options.length === 0 ?
                            <Text style={styles.button}>
                                {Strings("message.empty_item")}
                            </Text>
                            :
                            <Text onPress={() => this.showActionSheet()} style={styles.button}>
                                {options[this.props.value]}
                            </Text>

                    ),
                    android: (
                        <Picker
                            selectedValue={this.props.value}
                            style={styles.button}
                            onValueChange={(itemValue, buttonIndex) => {
                                //this.setState({ itemSelected: buttonIndex });
                                this.props.callParentMethod(type, buttonIndex);
                            }
                            }>

                            {
                                options.map((item, key) => {
                                    if (key !== cancelIndex)
                                        return <Picker.Item label={item} value={key} />
                                })
                            }
                        </Picker>
                    )
                })}


                <View style={styles.borderSpinder}></View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "auto"
    },
    borderSpinder: {
        marginLeft: normalize(24),
        marginTop: normalize(0),
        height: 1,
        borderBottomColor: "#d6d6d6",
        borderBottomWidth: 1,
    },
    button: {
        marginLeft: normalize(24)
    }
});

UpdePicker.defaultProps = {
    callParentMethod: () => { }
}

export default UpdePicker;