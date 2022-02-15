import React, {PureComponent} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import {normalize} from "../utils/ViewUtils";
import Strings from "../utils/LocalizationHelper";
import { connect } from "react-redux";

class IconWithBadge extends PureComponent {

	icon = (routeName) => {
		switch (routeName) {
			case "NotificationTab":
				return require('../assets/icons/ic_notification.png');
			case "StatisticTab":
				return require('../assets/icons/ic_chart.png');
			case "DriverManagementTab":
				return require('../assets/icons/icon_tab_driver.png');
			default:
				return require('../assets/icons/ic_account.png');
		}
	};

	title = (routeName) => {
		switch (routeName) {
			case "NotificationTab":
				return Strings("tab.notification");
			case "StatisticTab":
				return Strings("tab.statistic");
			case "DriverManagementTab":
				return Strings("tab.driver");
			default:
				return Strings("tab.account");
		}
	};

	getBadgeNumber = (routeName) => {
		switch (routeName) {
			case "NotificationTab":
				return this.props.countUnReadTrip;
			default:
				return 0;
		}
	}

	render() {
		const {routeName, badgeCount, color} = this.props;
		let numberBadge = this.getBadgeNumber(routeName);
		let numberBadgeShowed = numberBadge;
		if(numberBadge > 9){
			numberBadgeShowed = '9+'
		}
		return (
			<View style={{alignItems: 'center'}}>
				<Image
					source={this.icon(routeName)}
					style={{tintColor: color}}
					resizeMode="contain"
				/>

				{/* <Text style={{fontSize: normalize(9), color, marginTop: 2}}>{this.title(routeName)}</Text> */}
				{numberBadge > 0 && (
					<View style={styles.badge}>
						<Text style={{color: 'white', fontSize: normalize(8), fontWeight: 'bold'}}>{numberBadgeShowed}</Text>
					</View>
				)}
			</View>);
	}
}

const styles = StyleSheet.create({
	badge: {
		position: 'absolute',
		display: "flex",
		right: -6,
		top: -3,
		backgroundColor: 'red',
		borderRadius: 6,
		minWidth: 12,
		width: "auto",
		paddingLeft: 2,
		paddingRight: 2,
		height: 12,
		justifyContent: 'center',
		alignItems: 'center'
	}
});

const mapStateToProps = (state) => {
	return {
		countUnReadTrip: state.notificationReducer.bookingList.filter((item) => item.is_readed === false).length
	};
};


export default connect(mapStateToProps)(IconWithBadge)