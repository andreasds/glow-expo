import React, { Component } from 'react'
import { Alert, BackHandler, FlatList, Picker, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { PARENT_PRODUCT_ID, CHILD_PRODUCT_ID } from '../../../constants/database/products'
import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE, PRODUCT_PRICE } from '../../../constants/database/productsDetails'
import { SALE_AMOUNT, SALE_CUSTOMER_NAME, SALE_ID, SALE_TIME_CREATED } from '../../../constants/database/sales'
import { SALE_PRODUCT_ID } from '../../../constants/database/salesProducts'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'
import { STYLISTS_SERVICES_PRICE } from '../../../constants/database/stylistsServices'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { intToNumberCurrencyString, numberCurrencyStringToInt } from '../../../constants/utils/number'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/customer'
import { containerStyle, containerStyle2, containerStyle3, containerStyle4, containerStyle5, pickerContainer, scrollContainerStyle } from '../../../constants/styles/customer'
import { iconStyle } from '../../../constants/styles/customer'
import { listContainer2, listStyle2 } from '../../../constants/styles/customer'
import { modifyButtonContainerStyle2, modifyButtonStyle } from '../../../constants/styles/customer'
import { numberInputStyle, textStyle, textInputStyle } from '../../../constants/styles/customer'
import { titleTextStyle } from '../../../constants/styles/customer'

import { insertSale, salesGot, selectAllActiveSaleUnPaid, updateSale } from '../../../redux/actions/database/SaleActions'
import { deleteSaleDetail, insertSaleDetail } from '../../../redux/actions/database/SaleDetailActions'
import { deleteSaleProduct, insertSaleProduct } from '../../../redux/actions/database/SaleProductActions'

class ModifyCustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let mode = navigation.getParam('mode', '')
        let sale = navigation.getParam('sale', {})
        if (!sale.products) { sale.products = [] }
        let packages = navigation.getParam('packages', {})
        let stylistsServices = navigation.getParam('stylistsServices', {})
        this.state = {
            mode,
            sale,
            packages,
            stylistsServices,
            loading: 0,
            result: '',
            error: '',
            insertSaleDetailCount: 0
        }

        this._reinitializeModifyCustomer = this._reinitializeModifyCustomer.bind(this)
        this._onCancelButtonPressed = this._onCancelButtonPressed.bind(this)
    }

    _reinitializeModifyCustomer(_result) {
        for (let key in _result) {
            switch (key) {
                case 'insertSale':
                case 'updateSale': {
                    if (_result[key].result === 'success') {
                        if (key === 'insertSale') {
                            let sale = this.state.sale
                            sale[SALE_ID] = _result[key].insertId
                            this.setState({ sale })
                        }

                        this.setState({ loading: this.state.loading + 1 })
                        deleteSaleDetail(this.props.database.db, this.state.sale[SALE_ID], this._reinitializeModifyCustomer)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'insertSaleDetail': {
                    this.setState({ insertSaleDetailCount: this.state.insertSaleDetailCount - 1 })
                    if (_result[key].result === 'success') {
                        if (this.state.insertSaleDetailCount === 0) {
                            this.setState({
                                result: _result[key].result,
                                loading: this.state.loading + 1
                            })
                            selectAllActiveSaleUnPaid(this.props.database.db, SALE_TIME_CREATED, 'asc', this._reinitializeModifyCustomer)
                        }
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'insertSaleProduct': {
                    if (_result[key].result === 'success') {
                        for (let packageIndex in _result[key].saleProduct.packages) {
                            let saleDetail = _result[key].saleProduct.packages[packageIndex]
                            saleDetail[SALE_PRODUCT_ID] = _result[key].insertId
                            this.setState({
                                loading: this.state.loading + 1,
                                insertSaleDetailCount: this.state.insertSaleDetailCount + 1
                            })
                            insertSaleDetail(this.props.database.db, saleDetail, this._reinitializeModifyCustomer)
                        }
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'deleteSaleDetail': {
                    if (_result[key].result === 'success') {
                        this.setState({ loading: this.state.loading + 1 })
                        deleteSaleProduct(this.props.database.db, this.state.sale[SALE_ID], this._reinitializeModifyCustomer)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'deleteSaleProduct': {
                    if (_result[key].result === 'success') {
                        if (this.state.sale.products.length) {
                            for (let productIndex in this.state.sale.products) {
                                let saleProduct = this.state.sale.products[productIndex]
                                saleProduct[SALE_ID] = this.state.sale[SALE_ID]
                                this.setState({ loading: this.state.loading + 1 })
                                insertSaleProduct(this.props.database.db, saleProduct, this._reinitializeModifyCustomer)
                            }
                        } else {
                            this.setState({
                                result: _result[key].result,
                                loading: this.state.loading + 1
                            })
                            selectAllActiveSaleUnPaid(this.props.database.db, SALE_TIME_CREATED, 'asc', this._reinitializeModifyCustomer)
                        }
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'salesUnPaid': {
                    let sales = _result[key]
                    this.props.salesGot(sales._array, sales.length)
                    this.setState({ loading: this.state.loading - 1 })

                    const { goBack } = this.props.navigation
                    goBack()
                    break
                }
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onCancelButtonPressed)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onCancelButtonPressed)
    }

    _getEmptyPackages(products) {
        let packages = []
        for (productIndex in products) {
            let saleDetail = {}
            saleDetail[STYLIST_ID] = this.props.stylist.stylistsLen > 0 ? this.props.stylist.stylists[0][STYLIST_ID] : null
            saleDetail[PRODUCT_ID] = products[productIndex][CHILD_PRODUCT_ID]
            packages.push(saleDetail)
        }
        return packages
    }

    _onAddTreatmentButtonPressed() {
        let sale = this.state.sale
        let products = sale.products

        let saleProduct = {}
        saleProduct[PRODUCT_ID] = 0
        saleProduct.packages = this._getEmptyPackages([{ 'child_product_id': 0 }])

        products.push(saleProduct)
        sale.products = products
        this.setState({ sale })
    }

    _onRemoveTreatmentPressed(productIndex) {
        let productName = this._getProductName(this.state.sale.products[productIndex][PRODUCT_ID])
        Alert.alert(
            '',
            'Are you sure you want to delete ' + (productName === 'UNKNOWN' ? 'this product' : productName) + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        let sale = this.state.sale
                        let products = []
                        for (productIdx in sale.products) {
                            if (productIdx !== productIndex.toString()) {
                                products.push(sale.products[productIdx])
                            }
                        }
                        sale.products = products
                        this.setState({ sale })
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    _onResetStylistServicePricePressed(productIndex) {
        Alert.alert(
            '',
            'Are you sure you want to reset price of ' + this._getProductName(this.state.sale.products[productIndex][PRODUCT_ID]) + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        let sale = this.state.sale
                        if (sale.products[productIndex][PRODUCT_PACKAGE] === 'Y') {
                            sale.products[productIndex][PRODUCT_PRICE] = this._getProductPrice(sale.products[productIndex][PRODUCT_ID])
                        } else {
                            sale.products[productIndex][PRODUCT_PRICE] = this._getStylistServicePrice(sale.products[productIndex].packages[0][STYLIST_ID], sale.products[productIndex].packages[0][PRODUCT_ID])
                        }
                        this.setState({ sale })
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    _getTotalPrice() {
        let sale = this.state.sale
        let products = []
        let price = 0
        for (productIndex in sale.products) {
            if (sale.products[productIndex][PRODUCT_ID] !== 0) {
                products.push(sale.products[productIndex])
                price += sale.products[productIndex][PRODUCT_PRICE]
            }
        }
        sale.products = products
        sale[SALE_AMOUNT] = price
        this.setState({ sale })
    }

    _onSaveButtonPressed() {
        if (this.state.sale[SALE_CUSTOMER_NAME]) {
            this._getTotalPrice()
            let sale = this.state.sale
            sale[SALE_CUSTOMER_NAME] = !sale[SALE_CUSTOMER_NAME] ? '' : sale[SALE_CUSTOMER_NAME].trim()
            this.setState({
                loading: this.state.loading + 1,
                sale
            })

            if (this.state.mode === 'add') {
                insertSale(this.props.database.db, this.state.sale, this._reinitializeModifyCustomer)
            } else if (this.state.mode === 'edit') {
                updateSale(this.props.database.db, this.state.sale, this._reinitializeModifyCustomer)
            }
        } else {
            Alert.alert(
                '',
                'Customer name cannot be empty!',
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
            this.state.mode === 'add' ?
                'Are you sure you want to cancel?' :
                this.state.mode === 'edit' ?
                    'Are you sure you want to discard this change?' :
                    'UNKNOWN MODE',
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
        return true
    }

    _getProductPackage(parent_product_id) {
        let packages = []
        for (packagesIndex in this.state.packages) {
            if (this.state.packages[packagesIndex][PARENT_PRODUCT_ID] == parent_product_id) {
                packages.push(this.state.packages[packagesIndex])
            }
        }
        return packages
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

    _getProductPrice(product_id) {
        let products = this.props.product.products
        for (productIndex in products) {
            if (products[productIndex][PRODUCT_ID] === product_id) {
                return products[productIndex][PRODUCT_PRICE]
            }
        }
        return 0
    }

    _getStylistServicePrice(stylist_id, product_id) {
        let stylistsServices = this.state.stylistsServices
        for (stylistServiceIndex in stylistsServices) {
            if (stylistsServices[stylistServiceIndex][STYLIST_ID] === stylist_id &&
                stylistsServices[stylistServiceIndex][PRODUCT_ID] === product_id) {
                return stylistsServices[stylistServiceIndex][STYLISTS_SERVICES_PRICE]
            }
        }
        return 0
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            if (this.state.result === '') {
                if (this.state.mode === 'add') {
                    return loadingScreen('Save new customer into database', '')
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('Update customer into database', '')
                } else {
                    return loadingScreen('Unknown mode', '')
                }
            } else if (this.state.result === 'error') {
                if (this.state.mode === 'add') {
                    return loadingScreen('ERROR Save new customer into database', this.state.error)
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('ERROR Update customer into database', this.state.error)
                } else {
                    return loadingScreen('Unknown mode', this.state.error)
                }
            } else {
                return loadingScreen('Updating list customers', '')
            }
        }

        return (
            <View style={containerStyle}>
                {
                    this.state.mode === 'add' ?
                        <Text style={titleTextStyle}>ADD CUSTOMER</Text> :
                        this.state.mode === 'edit' ?
                            <Text style={titleTextStyle}>EDIT CUSTOMER</Text> :
                            <Text style={titleTextStyle}>UNKNOWN MODE</Text>
                }
                <ScrollView style={scrollContainerStyle}>
                    <Text style={textStyle}>Name *</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => {
                            let sale = this.state.sale
                            sale[SALE_CUSTOMER_NAME] = text
                            this.setState({ sale })
                        }}
                        selectTextOnFocus={true}
                        style={textInputStyle}
                        placeholder='Customer Name'
                        value={this.state.sale[SALE_CUSTOMER_NAME]} />
                    <Text style={textStyle}>Treatment</Text>
                    <FlatList
                        data={this.state.sale.products}
                        extraData={this.state}
                        keyExtractor={(productItem, productIndex) => productIndex.toString()}
                        style={listStyle2}
                        renderItem={({ item, index }) => (
                            <View style={listContainer2}>
                                <View style={containerStyle2}>
                                    <View style={containerStyle3}>
                                        <View style={pickerContainer}>
                                            <Picker
                                                mode='dropdown'
                                                onValueChange={(productId, productIndex) => {
                                                    let sale = this.state.sale
                                                    let products = sale.products
                                                    products[index][PRODUCT_ID] = productId
                                                    products[index][PRODUCT_PACKAGE] = productId === 0 ? '' : this.props.product.products[productIndex - 1][PRODUCT_PACKAGE]
                                                    if (products[index][PRODUCT_PACKAGE] === 'Y') {
                                                        products[index][PRODUCT_PRICE] = this.props.product.products[productIndex - 1][PRODUCT_PRICE]
                                                        let packages = this._getProductPackage(productId)
                                                        products[index].packages = this._getEmptyPackages(packages)
                                                    } else {
                                                        products[index][PRODUCT_PRICE] = 0
                                                        products[index].packages = this._getEmptyPackages([{ 'child_product_id': productId }])
                                                    }
                                                    sale.products = products
                                                    this.setState({ sale })
                                                }}
                                                selectedValue={item[PRODUCT_ID]}>
                                                <Picker.Item label={'- Choose Treatment -'} value={0} />
                                                {
                                                    this.props.product.products.map((productItem, productIndex) => {
                                                        return (
                                                            <Picker.Item
                                                                label={productItem[PRODUCT_NAME]}
                                                                key={productIndex}
                                                                value={productItem[PRODUCT_ID]}
                                                            />
                                                        )
                                                    })
                                                }
                                            </Picker>
                                        </View>
                                        {
                                            this.state.sale.products[index][PRODUCT_PACKAGE] === 'N' ?
                                                <View style={pickerContainer}>
                                                    <Picker
                                                        mode='dropdown'
                                                        onValueChange={(stylistId, stylistIndex) => {
                                                            let sale = this.state.sale
                                                            let products = sale.products
                                                            let packages = products[index].packages
                                                            packages[0][STYLIST_ID] = stylistId
                                                            products[index].packages = packages
                                                            products[index][PRODUCT_PRICE] = this._getStylistServicePrice(stylistId, products[index][PRODUCT_ID])
                                                            sale.products = products
                                                            this.setState({ sale })
                                                        }}
                                                        selectedValue={item.packages[0][STYLIST_ID]}>
                                                        {
                                                            this.props.stylist.stylists.map((stylistItem, stylistIndex) => {
                                                                return (
                                                                    <Picker.Item
                                                                        label={stylistItem[STYLIST_FIRST_NAME] + ' ' + stylistItem[STYLIST_LAST_NAME]}
                                                                        key={stylistIndex}
                                                                        value={stylistItem[STYLIST_ID]}
                                                                    />
                                                                )
                                                            })
                                                        }
                                                    </Picker>
                                                </View> :
                                                null
                                        }
                                        {
                                            this.state.sale.products[index][PRODUCT_PACKAGE] === 'Y' ||
                                                this.state.sale.products[index][PRODUCT_PACKAGE] === 'N' ?
                                                <TextInput
                                                    keyboardType='numeric'
                                                    maxLength={11}
                                                    onChangeText={(text) => {
                                                        let sale = this.state.sale
                                                        let products = sale.products
                                                        products[index][PRODUCT_PRICE] = numberCurrencyStringToInt(text)
                                                        sale.products = products
                                                        this.setState({ sale })
                                                    }}
                                                    selectTextOnFocus={true}
                                                    style={numberInputStyle}
                                                    placeholder='Price'
                                                    value={intToNumberCurrencyString(this.state.sale.products[index][PRODUCT_PRICE], 0)} /> :
                                                null
                                        }
                                    </View>
                                    <View style={modifyButtonContainerStyle2}>
                                        <TouchableHighlight
                                            onPress={() => this._onRemoveTreatmentPressed(index)}
                                            style={modifyButtonStyle}
                                            underlayColor={highlightButtonColor}>
                                            <FontAwesome color='white' name='remove' size={32} style={iconStyle} />
                                        </TouchableHighlight>
                                        {
                                            this.state.sale.products[index][PRODUCT_PACKAGE] === 'Y' ||
                                                this.state.sale.products[index][PRODUCT_PACKAGE] === 'N' ?
                                                <TouchableHighlight
                                                    onPress={() => this._onResetStylistServicePricePressed(index)}
                                                    style={modifyButtonStyle}
                                                    underlayColor={highlightButtonColor}>
                                                    <FontAwesome color='white' name='refresh' size={30} style={iconStyle} />
                                                </TouchableHighlight> :
                                                null
                                        }
                                    </View>
                                </View>
                                {
                                    this.state.sale.products[index][PRODUCT_PACKAGE] === 'Y' ?
                                        <View style={containerStyle4}>
                                            {
                                                item.packages.map((packageItem, packageIndex) => {
                                                    return (
                                                        <View
                                                            key={packageIndex}
                                                            style={containerStyle5}>
                                                            <View style={pickerContainer}>
                                                                <Picker
                                                                    mode='dropdown'
                                                                    enabled={false}
                                                                    selectedValue={item.packages[packageIndex][PRODUCT_ID]}>
                                                                    <Picker.Item label={'- Choose Treatment -'} value={0} />
                                                                    {
                                                                        this.props.product.products.map((productItem, productIndex) => {
                                                                            return (
                                                                                <Picker.Item
                                                                                    label={productItem[PRODUCT_NAME]}
                                                                                    key={productIndex}
                                                                                    value={productItem[PRODUCT_ID]}
                                                                                />
                                                                            )
                                                                        })
                                                                    }
                                                                </Picker>
                                                            </View>
                                                            <View style={pickerContainer}>
                                                                <Picker
                                                                    mode='dropdown'
                                                                    onValueChange={(stylisyId, stylistIndex) => {
                                                                        let sale = this.state.sale
                                                                        let packages = sale.products[index].packages
                                                                        packages[packageIndex][STYLIST_ID] = stylisyId
                                                                        sale.products[index].packages = packages
                                                                        this.setState({ sale })
                                                                    }}
                                                                    selectedValue={item.packages[packageIndex][STYLIST_ID]}>
                                                                    {
                                                                        this.props.stylist.stylists.map((stylistItem, stylistIndex) => {
                                                                            return (
                                                                                <Picker.Item
                                                                                    label={stylistItem[STYLIST_FIRST_NAME] + ' ' + stylistItem[STYLIST_LAST_NAME]}
                                                                                    key={stylistIndex}
                                                                                    value={stylistItem[STYLIST_ID]}
                                                                                />
                                                                            )
                                                                        })
                                                                    }
                                                                </Picker>
                                                            </View>
                                                        </View>
                                                    )
                                                })
                                            }
                                        </View> :
                                        null
                                }
                            </View>
                        )}
                    />
                    <TouchableHighlight
                        onPress={() => this._onAddTreatmentButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>ADD TREATMENT</Text>
                        </View>
                    </TouchableHighlight>
                </ScrollView>
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onSaveButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>SAVE</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => this._onCancelButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>CANCEL</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCustomerScreen)
