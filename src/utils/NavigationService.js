import {NavigationActions} from 'react-navigation';
import Toast from 'react-native-simple-toast';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
	_navigator = navigatorRef;
}

function navigate(routeName, subRoute, params) {
	console.log("NavigationActions.navigate: " + subRoute);
	_navigator.dispatch(
		NavigationActions.navigate({
			type: NavigationActions.NAVIGATE,
			routeName: routeName,
			params: params,
			action: NavigationActions.navigate({ routeName: subRoute })
		})
	);
}

// add other navigation functions that you need and export them
function goBack(key) {
	_navigator.dispatch(
		NavigationActions.back({
			key
		})
	);
}

export default {
	goBack,
	navigate,
	setTopLevelNavigator,
};
