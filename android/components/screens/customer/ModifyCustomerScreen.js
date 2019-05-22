import React, { Component } from 'react'
import { Alert, BackHandler, FlatList, Picker, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { PARENT_PRODUCT_ID, CHILD_PRODUCT_ID } from '../../../constants/database/products'
import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE, PRODUCT_PRICE } from '../../../constants/database/productsDetails'
import { SALE_AMOUNT, SALE_CUSTOMER_NAME } from '../../../constants/database/sales'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'
import { STYLISTS_SERVICES_PRICE } from '../../../constants/database/stylistsServices'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { intToNumberCurrencyString, numberCurrencyStringToInt } from '../../../constants/utils/number'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/customer'
import { containerStyle, containerStyle2, containerStyle3, containerStyle4, containerStyle5, pickerContainer, scrollContainerStyle } from '../../../constants/styles/customer'
import { iconStyle } from '../../../constants/styles/customer'
import { listContainer, listStyle2 } from '../../../constants/styles/customer'
import { modifyButtonContainerStyle2, modifyButtonStyle } from '../../../constants/styles/customer'
import { numberInputStyle, textStyle, textInputStyle } from '../../../constants/styles/customer'
import { titleTextStyle } from '../../../constants/styles/customer'

class ModifyCustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let mode = navigation.getParam('mode', '')
        let customer = navigation.getParam('customer', {})
        if (!customer.products) { customer.products = [] }
        let packages = navigation.getParam('packages', {})
        let stylistsServices = navigation.getParam('stylistsServices', {})
        this.state = {
            mode,
            customer,
            packages,
            stylistsServices,
            loading: 0,
            result: '',
            error: ''
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
        let customer = this.state.customer
        let products = customer.products

        let saleProduct = {}
        saleProduct[PRODUCT_ID] = 0
        saleProduct.packages = this._getEmptyPackages([{ 'child_product_id': 0 }])

        products.push(saleProduct)
        customer.products = products
        this.setState({ customer })
    }

    _onRemoveTreatmentPressed(productIndex) {
        let productName = this._getProductName(this.state.customer.products[productIndex][PRODUCT_ID])
        Alert.alert(
            '',
            'Are you sure you want to delete ' + (productName === 'UNKNOWN' ? 'this product' : productName) + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        let customer = this.state.customer
                        let products = []
                        for (productIdx in customer.products) {
                            if (productIdx !== productIndex.toString()) {
                                products.push(customer.products[productIdx])
                            }
                        }
                        customer.products = products
                        this.setState({ customer })
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
            'Are you sure you want to reset price of ' + this._getProductName(this.state.customer.products[productIndex][PRODUCT_ID]) + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        let customer = this.state.customer
                        if (customer.products[productIndex][PRODUCT_PACKAGE] === 'Y') {
                            customer.products[productIndex][PRODUCT_PRICE] = this._getProductPrice(customer.products[productIndex][PRODUCT_ID])
                        } else {
                            customer.products[productIndex][PRODUCT_PRICE] = this._getStylistServicePrice(customer.products[productIndex].packages[0][STYLIST_ID], customer.products[productIndex].packages[0][PRODUCT_ID])
                        }
                        this.setState({ customer })
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    _getTotalPrice() {
        let customer = this.state.customer
        let products = []
        let price = 0
        for (productIndex in customer.products) {
            console.log('product = ' + JSON.stringify(customer.products[productIndex]))
            if (customer.products[productIndex][PRODUCT_ID] !== 0) {
                products.push(customer.products[productIndex])
                price += customer.products[productIndex][PRODUCT_PRICE]
            }
        }
        customer.products = products
        customer[SALE_AMOUNT] = price
        this.setState({ customer })
    }

    _onSaveButtonPressed() {
        console.log('customer = ' + JSON.stringify(this.state.customer))
        if (this.state.customer[SALE_CUSTOMER_NAME]) {
            this._getTotalPrice()
            let customer = this.state.customer
            customer[SALE_CUSTOMER_NAME] = !customer[SALE_CUSTOMER_NAME] ? '' : customer[SALE_CUSTOMER_NAME].trim()
            this.setState({
                loading: this.state.loading + 1,
                customer
            })

            if (this.state.mode === 'add') {

            } else if (this.state.mode === 'edit') {

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
                            let customer = this.state.customer
                            customer[SALE_CUSTOMER_NAME] = text
                            this.setState({ customer })
                        }}
                        selectTextOnFocus={true}
                        style={textInputStyle}
                        placeholder='Customer Name'
                        value={this.state.customer[SALE_CUSTOMER_NAME]} />
                    <Text style={textStyle}>Treatment</Text>
                    <FlatList
                        data={this.state.customer.products}
                        extraData={this.state}
                        keyExtractor={(productItem, productIndex) => productIndex.toString()}
                        style={listStyle2}
                        renderItem={({ item, index }) => (
                            <View style={listContainer}>
                                <View style={containerStyle2}>
                                    <View style={containerStyle3}>
                                        <View style={pickerContainer}>
                                            <Picker
                                                mode='dropdown'
                                                onValueChange={(productId, productIndex) => {
                                                    let customer = this.state.customer
                                                    let products = customer.products
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
                                                    customer.products = products
                                                    this.setState({ customer })
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
                                            this.state.customer.products[index][PRODUCT_PACKAGE] === 'N' ?
                                                <View style={pickerContainer}>
                                                    <Picker
                                                        mode='dropdown'
                                                        onValueChange={(stylistId, stylistIndex) => {
                                                            let customer = this.state.customer
                                                            let products = customer.products
                                                            let packages = products[index].packages
                                                            packages[0][STYLIST_ID] = stylistId
                                                            products[index].packages = packages
                                                            products[index][PRODUCT_PRICE] = this._getStylistServicePrice(stylistId, products[index][PRODUCT_ID])
                                                            customer.products = products
                                                            this.setState({ customer })
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
                                            this.state.customer.products[index][PRODUCT_PACKAGE] === 'Y' ||
                                                this.state.customer.products[index][PRODUCT_PACKAGE] === 'N' ?
                                                <TextInput
                                                    keyboardType='numeric'
                                                    maxLength={11}
                                                    onChangeText={(text) => {
                                                        let customer = this.state.customer
                                                        let products = customer.products
                                                        products[index][PRODUCT_PRICE] = numberCurrencyStringToInt(text)
                                                        customer.products = products
                                                        this.setState({ customer })
                                                    }}
                                                    selectTextOnFocus={true}
                                                    style={numberInputStyle}
                                                    placeholder='Price'
                                                    value={intToNumberCurrencyString(this.state.customer.products[index][PRODUCT_PRICE], 0)} /> :
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
                                            this.state.customer.products[index][PRODUCT_PACKAGE] === 'Y' ||
                                                this.state.customer.products[index][PRODUCT_PACKAGE] === 'N' ?
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
                                    this.state.customer.products[index][PRODUCT_PACKAGE] === 'Y' ?
                                        < View style={containerStyle4}>
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
                                                                        let customer = this.state.customer
                                                                        let packages = customer.products[index].packages
                                                                        packages[packageIndex][STYLIST_ID] = stylisyId
                                                                        customer.products[index].packages = packages
                                                                        this.setState({ customer })
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
    databaseOpened: (db) => dispatch(databaseOpened(db)),
    stylistsGot: (stylists, stylistsLen) => dispatch(stylistsGot(stylists, stylistsLen)),
    productsGot: (products, productsLen) => dispatch(productsGot(products, productsLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModifyCustomerScreen)
