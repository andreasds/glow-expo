import React, { Component } from 'react'
import { ActivityIndicator, Alert, DatePickerAndroid, FlatList, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { SALE_AMOUNT, SALE_CUSTOMER_NAME, SALE_ID, SALE_TIME_PAID } from '../../../constants/database/sales'
import { SALE_PRODUCT_ID } from '../../../constants/database/salesProducts'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { getCurrentDate, getDateString } from '../../../constants/utils/date'
import { intToNumberCurrencyString } from '../../../constants/utils/number'

import { selectAllPackage } from '../../../redux/actions/database/ProductActions'
import { selectAllActiveSalePaid } from '../../../redux/actions/database/SaleActions'
import { selectAllSaleDetailBySale } from '../../../redux/actions/database/SaleDetailActions'
import { selectAllSaleProductBySale } from '../../../redux/actions/database/SaleProductActions'
import { selectAllStylistService } from '../../../redux/actions/database/StylistServiceActions'

import { activityIndicatorStyle } from '../../../constants/styles/customer'
import { highlightButtonColor } from '../../../constants/styles/customer'
import { containerStyle, containerStyle3 } from '../../../constants/styles/customer'
import { dateButtonStyle, dateContainerStyle, dateTextInputStyle, dateTextStyle } from '../../../constants/styles/customer'
import { iconStyle } from '../../../constants/styles/customer'
import { lineStyle } from '../../../constants/styles/customer'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/customer'
import { modifyButtonContainerStyle2, modifyButtonStyle } from '../../../constants/styles/customer'
import { titleTextStyle } from '../../../constants/styles/customer'

class HistoryCustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let sales = navigation.getParam('sales', [])
        let startDate = navigation.getParam('startDate', getCurrentDate())
        let endDate = navigation.getParam('endDate', getCurrentDate())
        this.state = {
            loading: 0,
            search: 0,
            sales,
            sale: {},
            startDate,
            endDate,
            process: '',
            result: '',
            error: ''
        }

        this._reinitializeHistoryCustomer = this._reinitializeHistoryCustomer.bind(this)
    }

    _reinitializeHistoryCustomer(_result) {
        for (let key in _result) {
            switch (key) {
                case 'stylistsServices':
                    let stylistsServices = _result[key]._array
                    this.setState({
                        loading: this.state.loading + 1,
                        stylistsServices
                    })
                    selectAllPackage(this.props.database.db, this._reinitializeHistoryCustomer)
                    this.setState({ loading: this.state.loading - 1 })
                    break
                case 'packages':
                    let packages = _result[key]._array
                    this.setState({
                        loading: this.state.loading - 1,
                        process: ''
                    })

                    const { navigate } = this.props.navigation
                    navigate('InfoCustomer', {
                        mode: 'history',
                        sale: this.state.sale,
                        packages,
                        stylistsServices: this.state.stylistsServices,
                        onGoBack: () => {
                            this._refreshSalePaid()
                        }
                    })
                    break
                case 'saleDetailBySale': {
                    let sale = this.state.sale
                    let products = this.state.products
                    for (detailIndex in _result[key]._array) {
                        products[_result[key]._array[detailIndex][SALE_PRODUCT_ID]].packages.push(_result[key]._array[detailIndex])
                    }

                    sale['products'] = []
                    for (saleProductId in products) {
                        sale['products'].push(products[saleProductId])
                    }

                    this.setState({
                        loading: this.state.loading + 1,
                        sale
                    })
                    selectAllStylistService(this.props.database.db, this._reinitializeHistoryCustomer)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'saleProductBySale': {
                    let products = this.state.products
                    for (productIndex in _result[key]._array) {
                        products[_result[key]._array[productIndex][SALE_PRODUCT_ID]] = _result[key]._array[productIndex]
                        products[_result[key]._array[productIndex][SALE_PRODUCT_ID]]['packages'] = []
                    }

                    this.setState({
                        loading: this.state.loading + 1,
                        products
                    })
                    selectAllSaleDetailBySale(this.props.database.db, this.state.sale[SALE_ID], this._reinitializeHistoryCustomer)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'salesPaid': {
                    let sales = _result[key]._array
                    this.setState({
                        search: this.state.search - 1,
                        sales
                    })
                    break
                }
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    _refreshSalePaid() {
        this.setState({ search: this.state.search + 1 })
        selectAllActiveSalePaid(this.props.database.db, this.state.startDate, this.state.endDate, SALE_TIME_PAID, 'desc', this._reinitializeHistoryCustomer)
    }

    _onInfoCustomerPressed(sale) {
        this.setState({
            loading: this.state.loading + 1,
            sale,
            process: 'history',
            products: {}
        })
        selectAllSaleProductBySale(this.props.database.db, sale[SALE_ID], this._reinitializeHistoryCustomer)
    }

    _onSearchCustomerPressed() {
        if (new Date(this.state.startDate) <= new Date(this.state.endDate)) {
            this.setState({ search: this.state.search + 1 })
            selectAllActiveSalePaid(this.props.database.db, this.state.startDate, this.state.endDate, SALE_TIME_PAID, 'desc', this._reinitializeHistoryCustomer)
        } else {
            Alert.alert(
                '',
                'Start date must be less than end date!',
                [
                    {
                        text: 'OK', onPress: () => { }
                    }
                ],
                { cancelable: true }
            )
        }
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            switch (this.state.process) {
                case 'history':
                    if (this.state.result === '') {
                        return loadingScreen('Get detail ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Get detail ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Get detail ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', 'Unknown process in ' + this.state.process + ' data')
                    }
                default:
                    return loadingScreen('ERROR ' + this.state.process + ': customer ' + this.state.sale[SALE_CUSTOMER_NAME], this.state.error)
            }
        }

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>HISTORY CUSTOMER</Text>
                <View style={dateContainerStyle}>
                    <TextInput
                        maxLength={50}
                        onFocus={async () => {
                            try {
                                const { action, year, month, day } = await DatePickerAndroid.open({
                                    date: new Date(this.state.startDate),
                                    maxDate: new Date(getCurrentDate())
                                })
                                if (action !== DatePickerAndroid.dismissedAction) {
                                    this.setState({ startDate: getDateString(year, month, day) })
                                }
                            } catch ({ code, message }) {
                                console.warn('Cannot open date picker', message)
                            }
                        }}
                        placeholder='Start Date'
                        selectTextOnFocus={true}
                        style={dateTextInputStyle}
                        value={this.state.startDate} />
                    <TextInput
                        maxLength={50}
                        onFocus={async () => {
                            try {
                                const { action, year, month, day } = await DatePickerAndroid.open({
                                    date: new Date(this.state.endDate),
                                    maxDate: new Date(getCurrentDate())
                                })
                                if (action !== DatePickerAndroid.dismissedAction) {
                                    this.setState({ endDate: getDateString(year, month, day) })
                                }
                            } catch ({ code, message }) {
                                console.warn('Cannot open date picker', message)
                            }
                        }}
                        placeholder='End Date'
                        selectTextOnFocus={true}
                        style={dateTextInputStyle}
                        value={this.state.endDate} />
                    <TouchableHighlight
                        onPress={() => this._onSearchCustomerPressed()}
                        style={dateButtonStyle}
                        underlayColor={highlightButtonColor}>
                        <FontAwesome color='white' name='search' size={30} style={iconStyle} />
                    </TouchableHighlight>
                </View>
                <View style={lineStyle} />
                {
                    this.state.search ?
                        <ActivityIndicator style={activityIndicatorStyle} animating={true} size='large' color='white' /> :
                        null
                }
                <FlatList
                    data={this.state.sales}
                    keyExtractor={(saleItem, saleIndex) => saleIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <View style={listContainer}>
                            <View style={containerStyle3}>
                                <Text style={dateTextStyle}>{item[SALE_TIME_PAID]}</Text>
                                <Text style={listTextStyle}>{item[SALE_CUSTOMER_NAME]}</Text>
                                <Text style={listTextStyle}>{'[ Rp ' + intToNumberCurrencyString(item[SALE_AMOUNT], 0) + ',00 ]'}</Text>
                            </View>
                            <View style={modifyButtonContainerStyle2}>
                                <TouchableHighlight
                                    onPress={() => this._onInfoCustomerPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='info' size={30} style={iconStyle} />
                                </TouchableHighlight>
                            </View>
                        </View>
                    )}
                />
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    return {
        database: { db }
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HistoryCustomerScreen)
