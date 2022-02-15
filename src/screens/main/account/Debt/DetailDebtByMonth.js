import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, FlatList, StyleSheet, Button } from "react-native";
import Strings from "../../../../utils/LocalizationHelper";
import { getListTripHistoryByMonth, GET_LIST_TRIP_HISTORY_DEBT } from '../AccountAction'
import ItemDetailDebt from "./ItemDetailDebt";
import Spinner from 'react-native-spinkit';
import { connect } from "react-redux";
import Colors from "../../../../assets/Colors";
import { normalize } from "../../../../utils/ViewUtils";
import { parseTimeRange } from '../../../../utils/Utils'

const SHORT_TEXT_FILTER = {
    all: "Tất cả",
    cash: "Tiền mặt",
    pay_online: "Trực tuyến",
    debt: "Công nợ"
}


class DetailDebtByMonth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowFilter: false,
            filterType: "all"
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            title: Strings("header.detaildept"),
            headerRight: (
                <TouchableOpacity style={styles.headerRight}
                    onPress={() => {
                        navigation.state.params.openFilter();
                    }}>
                    <Text style={styles.filterText}>{navigation.state.params.filterType}</Text>
                    <Image style={styles.icon} source={require("../../../../assets/icons/icon_filter.png")} />
                </TouchableOpacity>
            )
        };
    }

    getShortTextFilter = (type) => {
        return SHORT_TEXT_FILTER[type]
    }

    openFilter = () => {
        this.setState({
            isShowFilter: true
        })
    }
    closeFilter = () => {
        this.setState({
            isShowFilter: false
        })
    }

    fetchData = () => {
        let timeRange = parseTimeRange(this.props.navigation.state.params.time)
        this.props.getListTrip({ actionName: GET_LIST_TRIP_HISTORY_DEBT.actionName, ...timeRange, serial_before: 999999999 })
    }

    componentDidMount() {
        this.props.navigation.setParams({ openFilter: this.openFilter });
        this.props.navigation.setParams({ filterType: this.getShortTextFilter(this.state.filterType) });
        this.fetchData();
    }

    isActive = (type) => {
        return type === this.state.filterType ? { ...styles.filterOptions, ...styles.active } : styles.filterOptions
    }

    updateFilter = (value) => {
        this.setState({
            filterType: value,
            isShowFilter: false
        }, () => {
            this.props.navigation.setParams({ filterType: this.getShortTextFilter(this.state.filterType) });
        })
    }

    render() {
        const FILTER_TYPE_TEXT = {
            all: {
                value: "all",
                text: Strings("label.pay_method_all")
            },
            cash: {
                value: "cash",
                text: Strings("label.pay_method_cash")
            },
            pay_online: {
                value: "pay_online",
                text: Strings("label.pay_method_online")
            },
            debt: {
                value: "debt",
                text: Strings("label.pay_method_debt")
            },
        }

        if (this.props.isLoadingDetailDebt)
            return (<View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Spinner isVisible={this.props.isLoading} type={'Circle'} color={Colors.colorPrimary} size={60} />
            </View>);

        const { filterType, isShowFilter } = this.state;
        const data = this.props.listTripDetailDebt;
        let dataShowed = [];
        if (filterType === FILTER_TYPE_TEXT.all.value) {
            dataShowed = data;
        } else {
            data.map((item, key) => {
                if (item.payment_method === filterType)
                    dataShowed.push(item)

            })
        }

        return (
            <View style={styles.container}>
                {
                    dataShowed.length === 0 ?
                        <Text style={styles.empty}>{Strings("message.empty_item")}</Text> :
                        <FlatList
                            data={dataShowed}
                            renderItem={({ item, index }) => {
                                return <ItemDetailDebt data={item} />
                            }}
                            ListFooterComponent={() => {
                                return <View style={{ height: normalize(8) }}></View>
                            }}
                            keyExtractor={item => item.id}
                            refreshing={this.props.isLoadingDetailDebt}
                            onRefresh={this.fetchData}
                        />

                }

                {
                    isShowFilter &&
                    <View style={styles.wrapDialog}>
                        <View style={styles.dialog}>
                            <Text style={styles.header}>{Strings("label.pay_method")}</Text>
                            <Text style={styles.subHeader}>{Strings("label.pay_method_action")}</Text>
                            <TouchableOpacity
                                onPress={e => this.updateFilter(FILTER_TYPE_TEXT.all.value)}
                            >
                                <Text style={this.isActive(FILTER_TYPE_TEXT.all.value)}>{FILTER_TYPE_TEXT.all.text}</Text>
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={e => this.updateFilter(FILTER_TYPE_TEXT.cash.value)}
                            >
                                <Text style={this.isActive(FILTER_TYPE_TEXT.cash.value)}>{FILTER_TYPE_TEXT.cash.text}</Text>
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={e => this.updateFilter(FILTER_TYPE_TEXT.pay_online.value)}
                            >
                                <Text style={this.isActive(FILTER_TYPE_TEXT.pay_online.value)}>{FILTER_TYPE_TEXT.pay_online.text}</Text>
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={e => this.updateFilter(FILTER_TYPE_TEXT.debt.value)}>
                                <Text style={this.isActive(FILTER_TYPE_TEXT.debt.value)}>{FILTER_TYPE_TEXT.debt.text}</Text>
                                <View style={styles.line}></View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => this.closeFilter()}
                                style={styles.button}
                            >
                                <Text style={styles.btnText}>{Strings("auth.cancel")}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    icon: {
        width: 20,
        height: 20,
    },
    headerRight: {
        paddingHorizontal: 16,
        flexDirection: "row"
    },
    filterText: {
        fontSize: normalize(12),
        fontWeight: "600",
        marginRight: normalize(8),
        color: "#FF7900"
    },
    dialog: {
        height: "auto",
        paddingVertical: 25,
        paddingHorizontal: 16,
        width: "100%",
        borderRadius: 10,
        textAlign: "center",
        backgroundColor: "#FFFFFF"
    },
    wrapDialog: {
        paddingHorizontal: 16,
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#0000004D"
    },
    header: {
        fontSize: normalize(14),
        color: "#FF7900",
        textAlign: "center",
        fontWeight: "700",
        textTransform: "uppercase"
    },
    subHeader: {
        fontSize: normalize(10),
        marginTop: normalize(12),
        marginBottom: normalize(12),
        color: "#d6d6d6",
        textAlign: "center",
        fontWeight: "normal"
    },
    filterOptions: {
        marginBottom: normalize(8),
        marginTop: normalize(8),
        fontSize: normalize(12),
        color: "#000",
        textAlign: "center"
    },
    line: {
        width: "100%",
        height: 1,
        backgroundColor: "#d6d6d6"
    },
    button: {
        width: "100%",
        height: 40,
        marginTop: normalize(20),
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FF7900",
        borderRadius: 5,
    },
    btnText: {
        fontSize: normalize(12),
        textAlign: "center",
        textTransform: "uppercase",
        fontWeight: "700",
        color: "#FFF"
    },
    active: {
        color: "#FF7900",
    },
    empty: {
        textAlign: "center",
        top: "50%"
    },
    list: {
        width: "100%",
        height: "100%",
    }
})


const mapStateToProps = (state) => {
    return {
        listTripDetailDebt: state.accountReducer.listTripDetailDebt,
        isLoadingDetailDebt: state.accountReducer.isLoadingDetailDebt
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getListTrip: (data) => {
            dispatch(getListTripHistoryByMonth(data))
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(DetailDebtByMonth)