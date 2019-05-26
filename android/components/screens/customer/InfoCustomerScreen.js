import React, { Component } from 'react'
import { Alert, FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE } from '../../../constants/database/productsDetails'
import { CURRENT_TIMESTAMP, SALE_AMOUNT, SALE_AMOUNT_PAID, SALE_CUSTOMER_NAME, SALE_TIME_CREATED, SALE_TIME_PAID } from '../../../constants/database/sales'
import { SALE_PRODUCT_PRICE } from '../../../constants/database/salesProducts'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { intToNumberCurrencyString } from '../../../constants/utils/number'

import { salesGot, selectAllActiveSaleUnPaid, updateSale } from '../../../redux/actions/database/SaleActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/customer'
import { containerStyle, containerStyle2, containerStyle3, containerStyle6, scrollContainerStyle } from '../../../constants/styles/customer'
import { listContainer2, listStyle, listTextStyle } from '../../../constants/styles/customer'
import { numberInputStyle2, numberInputStyle3, textStyle } from '../../../constants/styles/customer'
import { titleTextStyle } from '../../../constants/styles/customer'

class InfoCustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let mode = navigation.getParam('mode', '')
        let sale = navigation.getParam('sale', {})
        let packages = navigation.getParam('packages', {})
        let stylistsServices = navigation.getParam('stylistsServices', {})
        this.state = {
            mode,
            sale,
            packages,
            stylistsServices,
            loading: 0,
            process: '',
            result: '',
            error: ''
        }

        this._reinitializeInfoCustomer = this._reinitializeInfoCustomer.bind(this)
    }

    _reinitializeInfoCustomer(_result) {
        for (let key in _result) {
            switch (key) {
                case 'updateSale': {
                    if (_result[key].result === 'error') {
                        console.log('ERROR Update sale = ' + JSON.stringify(_result[key].error))
                    }

                    this.setState({ loading: this.state.loading + 1 })
                    selectAllActiveSaleUnPaid(this.props.database.db, SALE_TIME_CREATED, 'asc', this._reinitializeInfoCustomer)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'salesUnPaid': {
                    let sales = _result[key]
                    this.props.salesGot(sales._array, sales.length)

                    if (this.state.mode === 'info') {
                        this.setState({
                            loading: this.state.loading + 1,
                            process: 'print'
                        })
                        this._onPrintRoutine()
                    } else {
                        this.props.navigation.state.params.onGoBack()
                        const { goBack } = this.props.navigation
                        goBack()
                    }

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    _onEditButtonPressed() {
        let sale = this.state.sale
        let packages = this.state.packages
        let stylistsServices = this.state.stylistsServices
        const { replace } = this.props.navigation
        replace('EditCustomer', {
            mode: 'edit',
            sale,
            packages,
            stylistsServices
        })
    }

    _onBackButtonPressed() {
        if (this.state.sale[SALE_TIME_PAID] === null ||
            this.state.mode === 'history') {
            const { goBack } = this.props.navigation
            goBack()
        } else {
            Alert.alert(
                '',
                'Are you done with customer ' + this.state.sale[SALE_CUSTOMER_NAME] + '?',
                [
                    {
                        text: 'OK', onPress: () => {
                            const { goBack } = this.props.navigation
                            goBack()
                        }
                    },
                    { text: 'Cancel', style: 'cancel' }
                ],
                { cancelable: true }
            )
        }
    }

    _onPrintRoutine() {
        console.log('PRINT!')
        this.setState({
            loading: this.state.loading - 1,
            process: ''
        })
    }

    _checkSale() {
        let default_stylist_id = this._getDefaultStylistId()
        let sale = this.state.sale
        if (sale.products.length === 0) return false
        for (productIndex in sale.products) {
            if (sale.products[productIndex][PRODUCT_ID] === 0) return false
            for (detailIndex in sale.products[productIndex].packages) {
                if (sale.products[productIndex].packages[detailIndex][PRODUCT_ID] === 0 ||
                    sale.products[productIndex].packages[detailIndex][STYLIST_ID] === default_stylist_id) {
                    return false
                }
            }
        }
        return true
    }

    _onPrintButtonPressed() {
        if (this._checkSale()) {
            Alert.alert(
                '',
                'Are you sure you want to print ' + this.state.sale[SALE_CUSTOMER_NAME] + '?',
                [
                    {
                        text: 'OK', onPress: () => {
                            this.setState({ loading: this.state.loading + 1 })
                            let sale = this.state.sale
                            if (sale[SALE_TIME_PAID] === null) {
                                sale[SALE_TIME_PAID] = CURRENT_TIMESTAMP
                                sale[SALE_AMOUNT_PAID] = sale[SALE_AMOUNT]
                                this.setState({
                                    sale,
                                    process: 'update'
                                })
                                updateSale(this.props.database.db, sale, this._reinitializeInfoCustomer)
                            } else {
                                this.setState({ process: 'print' })
                                this._onPrintRoutine()
                            }
                        }
                    },
                    { text: 'Cancel', style: 'cancel' }
                ],
                { cancelable: true }
            )
        } else {
            Alert.alert(
                '',
                'Check treatment list and employee list!',
                [
                    {
                        text: 'OK', onPress: () => { }
                    }
                ],
                { cancelable: true }
            )
        }
    }

    _onCancelButtonPressed() {
        Alert.alert(
            '',
            'Are you sure you want to cancel this ' + this.state.sale[SALE_CUSTOMER_NAME] + '\'s transaction?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({ loading: this.state.loading + 1 })
                        let sale = this.state.sale
                        sale[SALE_TIME_PAID] = null
                        sale[SALE_AMOUNT_PAID] = 0
                        this.setState({
                            sale,
                            process: 'update'
                        })
                        updateSale(this.props.database.db, sale, this._reinitializeInfoCustomer)
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    _getProductName(product_id) {
        let products = this.props.product.products
        for (productIndex in products) {
            if (products[productIndex][PRODUCT_ID] === product_id) {
                return products[productIndex][PRODUCT_NAME]
            }
        }
        return 'UNKNOWN'
    }

    _getStylistName(stylist_id) {
        let stylists = this.props.stylist.stylists
        for (stylistIndex in stylists) {
            if (stylists[stylistIndex][STYLIST_ID] === stylist_id) {
                return stylists[stylistIndex][STYLIST_FIRST_NAME] + ' ' + stylists[stylistIndex][STYLIST_LAST_NAME]
            }
        }
        return 'UNKNOWN'
    }

    _getDefaultStylistId() {
        for (stylistIndex in this.props.stylist.stylists) {
            if (this.props.stylist.stylists[stylistIndex][STYLIST_FIRST_NAME] === '- Choose Employee -') {
                return (this.props.stylist.stylists[stylistIndex][STYLIST_ID])
            }
        }
        return 0
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            switch (this.state.process) {
                case 'update':
                    if (this.state.result === '') {
                        return loadingScreen('Update customer ' + this.state.sale[SALE_CUSTOMER_NAME] + ' into database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Update customer ' + this.state.sale[SALE_CUSTOMER_NAME] + ' into database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Update customer ' + this.state.sale[SALE_CUSTOMER_NAME] + ' into database', 'Unknown process in ' + this.state.process + ' data')
                    }
                case 'print':
                    if (this.state.result === '') {
                        return loadingScreen('Print customer ' + this.state.sale[SALE_CUSTOMER_NAME], '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Print customer ' + this.state.sale[SALE_CUSTOMER_NAME], this.state.error)
                    } else {
                        return loadingScreen('ERROR Print customer ' + this.state.sale[SALE_CUSTOMER_NAME], 'Unknown process in print data')
                    }
                default:
                    return loadingScreen('ERROR ' + this.state.process + ': customer ' + this.state.sale[SALE_CUSTOMER_NAME], this.state.error)
            }
        }

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>CUSTOMER INFO</Text>
                <ScrollView style={scrollContainerStyle}>
                    <Text style={textStyle}>{this.state.sale[SALE_TIME_CREATED]}</Text>
                    <Text style={textStyle}>{this.state.sale[SALE_CUSTOMER_NAME]}</Text>
                    <Text style={textStyle}>{'Rp ' + intToNumberCurrencyString(this.state.sale[SALE_AMOUNT]) + ',00'}</Text>
                    <FlatList
                        data={this.state.sale.products}
                        extraData={this.state}
                        keyExtractor={(productItem, productIndex) => productIndex.toString()}
                        style={listStyle}
                        renderItem={({ item, index }) => (
                            <View style={listContainer2}>
                                <View style={containerStyle2}>
                                    <View style={containerStyle3}>
                                        <Text style={listTextStyle}>{this._getProductName(item[PRODUCT_ID])}</Text>
                                        {
                                            item[PRODUCT_PACKAGE] === 'N' ?
                                                <Text style={listTextStyle}>{'[ ' + this._getStylistName(item.packages[0][STYLIST_ID]) + ' ]'}</Text> :
                                                null
                                        }
                                    </View>
                                    <Text style={numberInputStyle2}>{intToNumberCurrencyString(item[SALE_PRODUCT_PRICE], 0)}</Text>
                                </View>
                                {
                                    item[PRODUCT_PACKAGE] === 'Y' ?
                                        <View style={containerStyle6}>
                                            {
                                                item.packages.map((packageItem, packageIndex) => {
                                                    return (
                                                        <Text key={packageIndex} style={numberInputStyle3}>{
                                                            this._getProductName(packageItem[PRODUCT_ID]) +
                                                            ' [ ' + this._getStylistName(packageItem[STYLIST_ID]) + ' ]'
                                                        }
                                                        </Text>
                                                    )
                                                })
                                            }
                                        </View> :
                                        null
                                }
                            </View>
                        )}
                    />
                </ScrollView>
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onPrintButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>PRINT</Text>
                        </View>
                    </TouchableHighlight>
                    {
                        this.state.sale[SALE_TIME_PAID] === null &&
                            this.state.mode === 'info' ?
                            <TouchableHighlight
                                onPress={() => this._onEditButtonPressed()}
                                style={buttonStyle}
                                underlayColor={highlightButtonColor}>
                                <View>
                                    <Text style={buttonTextStyle}>EDIT</Text>
                                </View>
                            </TouchableHighlight> :
                            null
                    }
                    {
                        this.state.sale[SALE_TIME_PAID] !== null &&
                            this.state.mode === 'history' ?
                            <TouchableHighlight
                                onPress={() => this._onCancelButtonPressed()}
                                style={buttonStyle}
                                underlayColor={highlightButtonColor}>
                                <View>
                                    <Text style={buttonTextStyle}>CANCEL</Text>
                                </View>
                            </TouchableHighlight> :
                            null
                    }
                    <TouchableHighlight
                        onPress={() => this._onBackButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>{this.state.sale[SALE_TIME_PAID] === null ? 'BACK' : 'DONE'}</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    const { products, productsLen } = state.productReducers
    const { stylists, stylistsLen } = state.stylistReducers
    return {
        database: { db },
        product: { products, productsLen },
        stylist: { stylists, stylistsLen }
    }
}

const mapDispatchToProps = dispatch => ({
    salesGot: (sales, salesLen) => dispatch(salesGot(sales, salesLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(InfoCustomerScreen)
