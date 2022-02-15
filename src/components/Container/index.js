import React, {Component} from 'react';
import {View, Dimensions, StyleSheet} from 'react-native';
import Colors from "../../assets/Colors";
import styles from "./styles.js";

export default class Container extends Component {

    _computeStyle(...args) {
        let styles = [];
        for (let i = 0; i < args.length; i++) {
            let arg = args[i];
            if (Array.isArray(arg)) {
                for (let _arg of arg) {
                    styles.push(_arg);
                }
            } else {
                styles.push(arg);
            }
        }
        return styles;
    }

    render() {
        const _style = this._computeStyle(styles.container, this.props.style);
        return (
            <View {...this.props} style={_style}>
                {this.props.children}
            </View>
        )
    }
}

Container.defaultProps = {
    style: {}
};
