/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from "react";
import {AppState} from 'react-native';
import AppNavigator from "./src/AppNavigator";
import {Provider} from "react-redux";
import {store} from "./src/AppStores";
import NavigationService from "./src/utils/NavigationService";
import AsyncStorage from '@react-native-community/async-storage';
import Strings, {setI18nConfig} from "./src/utils/LocalizationHelper";

console.disableYellowBox = true;


export default class App extends Component {
    constructor(props) {
        super(props);
        setI18nConfig(); // set initial config
    }

    componentDidMount() {
        console.log(Strings("notification.title"));
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = async (nextAppState) => {
        const appState = await AsyncStorage.getItem('AppState', '');
        if ((appState === 'inactive' || appState === 'background') && nextAppState === 'active') {
            console.log('App has come to the foreground!')
        }
        if (nextAppState === 'background') {
            console.log('App become background!')
        }

        AsyncStorage.setItem("AppState", nextAppState);
    };


    render() {
        return (
            < Provider
                store={store}>
                < AppNavigator
                    ref={navigatorRef => {
                        NavigationService.setTopLevelNavigator(navigatorRef);
                    }}
                />
            </Provider>);

    }
}

