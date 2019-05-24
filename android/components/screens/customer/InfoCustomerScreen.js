import React, { Component } from 'react'
import { FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE } from '../../../constants/database/productsDetails'
import { SALE_AMOUNT, SALE_CUSTOMER_NAME, SALE_TIME_CREATED } from '../../../constants/database/sales'
import { SALE_PRODUCT_PRICE } from '../../../constants/database/salesProducts'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'

import { intToNumberCurrencyString } from '../../../constants/utils/number'

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
            result: '',
            error: ''
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
        const { goBack } = this.props.navigation
        goBack()
    }

    _onPrintButtonPressed() {

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

    render() {
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
                    <TouchableHighlight
                        onPress={() => this._onEditButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>EDIT</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => this._onBackButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>BACK</Text>
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

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(InfoCustomerScreen)
