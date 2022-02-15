import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LoginScreen from "./screens/auth/LoginScreen";
import StatisticScreenDay from "./screens/main/statistics/StatisticScreenDay";
import StatisticScreenMonth from "./screens/main/statistics/StatisticScreenMonth";
import StatisticScreenYear from "./screens/main/statistics/StatisticScreenYear";
import DriverManageScreen from "./screens/main/driver/driver/DriverManageScreen";
import VehicleManageScreen from "./screens/main/driver/vehicle/VehicleManageScreen";
import AccountScreen from "./screens/main/account/AccountScreen";
import BookingScreen from "./screens/main/notification/booking/BookingScreen";
import ConfirmScreen from "./screens/main/notification/confirm/ConfirmScreen";
import CompletedScreen from "./screens/main/notification/completed/CompletedScreen";
import SplashScreen from "./screens/SplashScreen";
import Colors from "./assets/Colors";
import IconWithBadge from "./components/IconWithBadge";
import { View } from "react-native";
import CommonNotificationDetailContainer from "./screens/main/notification/common/CommonNotificationDetailContainer";
import { getTitleByIndexTab, getProfileTitleByIndex } from "./utils/Utils";
import { normalize } from "./utils/ViewUtils";
import UpdateInformation from "./screens/main/account/UpdateInformation";
import AddDriverScreen from "./screens/main/driver/driver/AddDriverScreen";
import AddVehicleScreen from "./screens/main/driver/vehicle/AddVehicleScreen";
import ChangePassword from "./screens/main/account/ChangePassword";
import Strings from "./utils/LocalizationHelper";
import DebtHistory from "./screens/main/account/Debt/DebtHistory"
import DetailDebtByMonth from "./screens/main/account/Debt/DetailDebtByMonth";
import AssignDriverScreen from "./screens/main/notification/assigndriver/AssignDriverScreen";
import DriverSelection from "./screens/main/notification/assigndriver/DriverSelection";
import VehicleSelection from "./screens/main/notification/assigndriver/VehicleSelection";
import DevelopModeScreen from "./screens/developer/DevelopModeScreen"
import Tracking from "./screens/main/tracking/Tracking"

const TEXT_ALIGN = "center"

const ProfileNavigator = createStackNavigator(
    {
        Profile: {
            screen: AccountScreen,
        }
    },
    {
        /* The header config from HomeScreen is now here */
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#FFFFFF',
                height: 80,
                alignItems: "center"
            },
            headerTintColor: Colors.colorPrimary,
            headerTitleStyle: {
                fontWeight: 'normal',
            },
        },
    }
);

const StatisticsNav = createMaterialTopTabNavigator({
    day: {
        screen: StatisticScreenDay,
        navigationOptions: {
            tabBarLabel: "Hàng ngày"
        }
    },
    month: {
        screen: StatisticScreenMonth,
        navigationOptions: {
            tabBarLabel: "Hàng tháng"
        }
    },
    year: {
        screen: StatisticScreenYear,
        navigationOptions: {
            tabBarLabel: "Hàng năm"
        }
    }

}, {
        tabBarOptions: {
            activeTintColor: "#FFFFFF",
            swipeEnabled: false,
            labelStyle: {
                fontSize: normalize(11),
                fontWeight: "bold"
            },
            style: {
                backgroundColor: Colors.colorPrimary
            },
            indicatorStyle: {
                backgroundColor: 'white'
            }
        }
    })

const DriverNav = createMaterialTopTabNavigator({
    Driver: {
        screen: DriverManageScreen,
        navigationOptions: {
            tabBarLabel: "Tài xế"
            // tabBarLabel: Strings('header.booking')
        }
    },
    Car: {
        screen: VehicleManageScreen,
        navigationOptions: {
            tabBarLabel: "Xe"
            // tabBarLabel: Strings('header.confirm')
        }
    }

}, {
        tabBarOptions: {
            activeTintColor: "#FFFFFF",
            labelStyle: {
                fontSize: normalize(11),
                fontWeight: "bold"
            },
            style: {
                backgroundColor: Colors.colorPrimary
            },
            indicatorStyle: {
                backgroundColor: 'white'
            }
        }
    });

const NotificationNav = createMaterialTopTabNavigator({
    Booking: {
        screen: BookingScreen,
        navigationOptions: {
            tabBarLabel: "Đặt xe"
            // tabBarLabel: Strings('header.booking')
        }
    },
    Confirm: {
        screen: ConfirmScreen,
        navigationOptions: {
            tabBarLabel: "Trạng thái"
            // tabBarLabel: Strings('header.confirm')
        }
    },
    Completed: {
        screen: CompletedScreen,
        navigationOptions: {
            tabBarLabel: "Hoàn thành"
            // tabBarLabel: Strings('header.completed')
        }
    }
}, {
        tabBarOptions: {
            activeTintColor: "#FFFFFF",
            labelStyle: {
                fontSize: normalize(11),
                fontWeight: "bold"
            },
            style: {
                backgroundColor: Colors.colorPrimary
            },
            indicatorStyle: {
                backgroundColor: 'white'
            }
        }
    });

const MainTabNavigation = createBottomTabNavigator({

    NotificationTab: {
        screen: NotificationNav
    },
    DriverManagementTab: {
        screen: DriverNav
    },
    StatisticTab: {
        screen: StatisticsNav
    },
    AccountTab: {
        screen: ProfileNavigator,
    }
}, {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) =>
                getTabBarIcon(navigation, focused, tintColor)
        }),
        tabBarOptions: {
            activeTintColor: Colors.colorPrimary,
            inactiveTintColor: Colors.colorGrey,
            tabStyle: {
                backgroundColor: "#ebebeb"
            },
            showLabel: false
        },
        navigationOptions: ({ navigation }) => {
            if (navigation.state.index === 3) {
                return {
                    header: null
                };
            }
            return {
                title: getTitleByIndexTab(navigation.state.index)
            };
        }
    });


const MainNavigator = createStackNavigator(
    {
        Main: {
            screen: MainTabNavigation,
            navigationOptions: {
                headerTitleStyle: {
                    fontSize: normalize(15),
                    color: "#FFFFFF",
                    textAlign: "center",
                    flex: 1
                },
                headerStyle: {
                    backgroundColor: Colors.colorPrimary,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0
                    },
                    shadowRadius: 0,
                    borderBottomWidth: 0,
                    elevation: 0
                },
                headerBackTitle: null,
                headerTintColor: Colors.colorWhite
            }
        },
        NotificationDetail: {
            screen: CommonNotificationDetailContainer.UpdeTripScreen,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />) //required to make title text center in android

            }
        },
        DeliveryDetail: {
            screen: CommonNotificationDetailContainer.DeliveryScreen,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />) //required to make title text center in android

            }
        },
        UpdateInformation: {
            screen: UpdateInformation,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)
            }
        },
        ChangePassword: {
            screen: ChangePassword,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)
            }
        },

        AddDriverScreen: {
            screen: AddDriverScreen,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },

            }
        },
        AddVehicleScreen: {
            screen: AddVehicleScreen,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },

            }
        },

        DebtHistory: {
            screen: DebtHistory,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)

            }
        },

        DetailDebtByMonth: {
            screen: DetailDebtByMonth,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },

            }
        },
        AssignDriverScreen: {
            screen: AssignDriverScreen,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)

            }
        },
        DriverSelection: {
            screen: DriverSelection,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)

            }
        },
        VehicleSelection: {
            screen: VehicleSelection,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)

            }
        },
        DevelopModeScreen: {
            screen: DevelopModeScreen,
            navigationOptions: {
                headerTintColor: Colors.colorPrimary,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerRight: (<View />)

            }
        },
        Tracking: {
            screen: Tracking,
            navigationOptions: {
                headerTintColor: Colors.colorWhite,
                headerTitleStyle: {
                    fontSize: normalize(15),
                    // fontSize: 21,
                    textAlign: TEXT_ALIGN,
                    alignSelf: "center",
                    flex: 1
                },
                headerStyle: {
                    backgroundColor: Colors.colorPrimary,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0
                    },
                    shadowRadius: 0,
                    borderBottomWidth: 0,
                    elevation: 0
                },
                headerRight: (<View />)

            }
        }

    },
    {
        initialRouteName: "Main" // need change to main
    }
);


const HomeIconWithBadge = props => {
    // You should pass down the badgeCount in some other ways like context, redux, mobx or event emitters.
    // return <ItemNotification {...props} badgeCount={3} />;
    return <IconWithBadge {...props} />;
};

const getTabBarIcon = (navigation, focused, tintColor) => {
    const { routeName } = navigation.state;
    // You can return any component that you like here!
    return <HomeIconWithBadge routeName={routeName} size={25} color={tintColor} badgeCount={3} />;
};

const AppNavigator = createSwitchNavigator(
    {
        Splash: {
            screen: SplashScreen,
            navigationOptions: {
                header: null
            }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: {
                header: null
            }
        },
        MainNav: {
            screen: MainNavigator,
            navigationOptions: {
                headerTitleStyle: {
                    fontSize: normalize(15),
                    color: "#FFFFFF",
                    textAlign: TEXT_ALIGN,
                    flex: 1
                },
                headerStyle: {
                    backgroundColor: Colors.colorPrimary,
                    shadowOpacity: 0,
                    shadowOffset: {
                        height: 0
                    },
                    shadowRadius: 0,
                    borderBottomWidth: 0,
                    elevation: 0
                },
                headerBackTitle: null,
                headerTintColor: Colors.colorWhite
            }
        }
    },
    {
        initialRouteName: "Splash"
    }
);

export default createAppContainer(AppNavigator);
