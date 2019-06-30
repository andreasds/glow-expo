import React, { Component } from 'react'
import { Alert, FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfo, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

import { SALE_AMOUNT, SALE_CUSTOMER_NAME, SALE_ID, SALE_TIME_CREATED, SALE_TIME_PAID } from '../../../constants/database/sales'
import { SALE_PRODUCT_ID } from '../../../constants/database/salesProducts'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { getCurrentDate } from '../../../constants/utils/date'
import { intToNumberCurrencyString } from '../../../constants/utils/number'

import { selectAllPackage } from '../../../redux/actions/database/ProductActions'
import { deleteSale, salesGot, selectAllActiveSalePaid, selectAllActiveSaleUnPaid } from '../../../redux/actions/database/SaleActions'
import { selectAllSaleDetailBySale } from '../../../redux/actions/database/SaleDetailActions'
import { selectAllSaleProductBySale } from '../../../redux/actions/database/SaleProductActions'
import { selectAllStylistService } from '../../../redux/actions/database/StylistServiceActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle2, highlightButtonColor } from '../../../constants/styles/customer'
import { containerStyle, containerStyle3 } from '../../../constants/styles/customer'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/customer'
import { modifyButtonContainerStyle, modifyButtonStyle } from '../../../constants/styles/customer'
import { titleTextStyle } from '../../../constants/styles/customer'

class CustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0,
            sale: {},
            process: '',
            result: '',
            error: ''
        }

        this._reinitializeCustomer = this._reinitializeCustomer.bind(this)
    }

    _reinitializeCustomer(_result) {
        for (let key in _result) {
            switch (key) {
                case 'stylistsServices':
                    let stylistsServices = _result[key]._array
                    this.setState({
                        loading: this.state.loading + 1,
                        stylistsServices
                    })
                    selectAllPackage(this.props.database.db, this._reinitializeCustomer)
                    this.setState({ loading: this.state.loading - 1 })
                    break
                case 'packages':
                    let packages = _result[key]._array
                    this.setState({ loading: this.state.loading - 1 })

                    const { navigate } = this.props.navigation
                    switch (this.state.process) {
                        case 'add':
                        case 'edit':
                        case 'info': {
                            let process = this.state.process
                            this.setState({ process: '' })
                            if (process === 'add') {
                                navigate('AddCustomer', {
                                    mode: 'add',
                                    packages,
                                    stylistsServices: this.state.stylistsServices
                                })
                            } else if (process === 'edit') {
                                navigate('EditCustomer', {
                                    mode: 'edit',
                                    sale: this.state.sale,
                                    packages,
                                    stylistsServices: this.state.stylistsServices
                                })
                            } else {
                                navigate('InfoCustomer', {
                                    mode: 'info',
                                    sale: this.state.sale,
                                    packages,
                                    stylistsServices: this.state.stylistsServices
                                })
                            }
                            break
                        }
                        default:
                            this.setState({
                                loading: this.state.loading + 1,
                                error: 'Failed to ' + this.state.process + ' process at get stylist services'
                            })
                            break
                    }
                    break
                case 'deleteSale': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({
                            loading: this.state.loading + 1,
                            result: ''
                        })
                        selectAllActiveSaleUnPaid(this.props.database.db, SALE_TIME_CREATED, 'asc', this._reinitializeCustomer)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
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
                    selectAllStylistService(this.props.database.db, this._reinitializeCustomer)

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
                    selectAllSaleDetailBySale(this.props.database.db, this.state.sale[SALE_ID], this._reinitializeCustomer)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'salesPaid': {
                    if (_result[key].result === 'error') {
                        this.setState({
                            error: _result[key].error,
                            result: _result[key].result
                        })
                    } else {
                        this.setState({
                            loading: this.state.loading - 1,
                            process: ''
                        })
                        let sales = _result[key]._array
                        const { navigate } = this.props.navigation
                        navigate('HistoryCustomer', {
                            sales,
                            startDate: _result[key].startDate,
                            endDate: _result[key].endDate
                        })
                    }
                    break
                }
                case 'salesUnPaid': {
                    let sales = _result[key]
                    this.props.salesGot(sales._array, sales.length)
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

    _onAddCustomerPressed() {
        this.setState({
            loading: this.state.loading + 1,
            process: 'add'
        })
        selectAllStylistService(this.props.database.db, this._reinitializeCustomer)
    }

    _onInfoCustomerPressed(sale) {
        this.setState({
            loading: this.state.loading + 1,
            sale,
            process: 'info',
            products: {}
        })
        selectAllSaleProductBySale(this.props.database.db, sale[SALE_ID], this._reinitializeCustomer)
    }

    _onEditCustomerPressed(sale) {
        this.setState({
            loading: this.state.loading + 1,
            sale,
            process: 'edit',
            products: {}
        })
        selectAllSaleProductBySale(this.props.database.db, sale[SALE_ID], this._reinitializeCustomer)
    }

    _onRemoveCustomerPressed(sale) {
        Alert.alert(
            '',
            'Are you sure you want to delete ' + sale[SALE_CUSTOMER_NAME] + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({
                            loading: this.state.loading + 1,
                            sale,
                            process: 'delete',
                            result: ''
                        })
                        deleteSale(this.props.database.db, sale, this._reinitializeCustomer)
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    _onHistoryCustomerPressed() {
        this.setState({
            loading: this.state.loading + 1,
            process: 'history'
        })
        let current_date = getCurrentDate()
        selectAllActiveSalePaid(this.props.database.db, current_date, current_date, SALE_TIME_PAID, 'desc', this._reinitializeCustomer)
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            switch (this.state.process) {
                case 'add':
                    if (this.state.result === '') {
                        return loadingScreen('Collect data to create new customer', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Collect data to create new customer', this.state.error)
                    } else {
                        return loadingScreen('ERROR Collect data to create new customer', 'Unknown process in ' + this.state.process + ' data')
                    }
                case 'info':
                case 'edit':
                    if (this.state.result === '') {
                        return loadingScreen('Get detail ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Get detail ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Get detail ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', 'Unknown process in ' + this.state.process + ' data')
                    }
                case 'delete':
                    if (this.state.result === '') {
                        return loadingScreen('Delete ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Delete ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Delete ' + this.state.sale[SALE_CUSTOMER_NAME] + ' in database', 'Unknown process in delete data')
                    }
                case 'history':
                    if (this.state.result === '') {
                        return loadingScreen('Collect history customer', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Collect history customer', this.state.error)
                    } else {
                        return loadingScreen('ERROR Collect history customer', 'Unknown process in ' + this.state.process + ' data')
                    }
                default:
                    return loadingScreen('ERROR ' + this.state.process + ': customer ' + this.state.sale[SALE_CUSTOMER_NAME], this.state.error)
            }
        }

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>CUSTOMERS LIST</Text>
                <FlatList
                    data={this.props.sale.sales}
                    keyExtractor={(saleItem, saleIndex) => saleIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <View style={listContainer}>
                            <View style={containerStyle3}>
                                <Text style={listTextStyle}>{item[SALE_CUSTOMER_NAME]}</Text>
                                <Text style={listTextStyle}>{'[ Rp ' + intToNumberCurrencyString(item[SALE_AMOUNT], 0) + ',00 ]'}</Text>
                            </View>
                            <View style={modifyButtonContainerStyle}>
                                <TouchableHighlight
                                    onPress={() => this._onInfoCustomerPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon color={'white'} icon={faInfo} size={26} />
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onEditCustomerPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon color={'white'} icon={faPencilAlt} size={26} />
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onRemoveCustomerPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon key={index} color={'white'} icon={faTimes} size={32} />
                                    </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )}
                />
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onAddCustomerPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <Text style={buttonTextStyle2}>ADD CUSTOMER</Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => this._onHistoryCustomerPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <Text style={buttonTextStyle2}>HISTORY</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    const { sales, salesLen } = state.saleReducers
    return {
        database: { db },
        sale: { sales, salesLen }
    }
}

const mapDispatchToProps = dispatch => ({
    salesGot: (sales, salesLen) => dispatch(salesGot(sales, salesLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(CustomerScreen)
