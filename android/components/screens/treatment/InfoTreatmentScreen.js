import React, { Component } from 'react'
import { FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE, PRODUCT_PRICE } from '../../../constants/database/productsDetails'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'

import { intToNumberCurrencyString } from '../../../constants/utils/number'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/treatment'
import { containerStyle, scrollContainerStyle } from '../../../constants/styles/treatment'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/treatment'
import { numberInputStyle2, textStyle } from '../../../constants/styles/treatment'
import { titleTextStyle } from '../../../constants/styles/treatment'

class InfoTreatmentScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let product = navigation.getParam('product', {})

        this.state = {
            product,
            loading: 0,
            result: '',
            error: ''
        }
    }

    _onEditButtonPressed() {
        let product = this.state.product
        const { replace } = this.props.navigation
        replace('EditTreatment', {
            mode: 'edit',
            product
        })
    }

    _onBackButtonPressed() {
        const { goBack } = this.props.navigation
        goBack()
    }

    _getProductPackageName(product_id) {
        let product_name = 'UNKNOWN'
        this.props.product.products.map((product) => {
            if (parseInt(product[PRODUCT_ID]) === product_id) {
                product_name = product[PRODUCT_NAME]
            }
        })
        return product_name
    }

    _filterListStylists() {
        let stylists = []
        for (stylistIndex in this.props.stylist.stylists) {
            if (this.props.stylist.stylists[stylistIndex][STYLIST_FIRST_NAME] !== '- Choose Employee -') {
                stylists.push(this.props.stylist.stylists[stylistIndex])
            }
        }
        return stylists
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        let stylists = this._filterListStylists()
        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>TREATMENT INFO</Text>
                <ScrollView style={scrollContainerStyle}>
                    <Text style={textStyle}>{this.state.product[PRODUCT_NAME]}</Text>
                    {
                        this.state.product[PRODUCT_PACKAGE] === 'Y' ?
                            <FlatList
                                data={Object.keys(this.state.product.packageItem)}
                                extraData={this.props}
                                keyExtractor={(productItem, productIndex) => productIndex.toString()}
                                style={listStyle}
                                renderItem={({ item, index }) => (
                                    <Text style={textStyle}>{'# ' + this._getProductPackageName(parseInt(item))}</Text>
                                )}
                            /> :
                            null
                    }
                    <Text style={textStyle}>{'Rp ' + intToNumberCurrencyString(this.state.product[PRODUCT_PRICE]) + ',00'}</Text>
                    <FlatList
                        data={stylists}
                        extraData={this.state}
                        keyExtractor={(stylistItem, stylistIndex) => stylistIndex.toString()}
                        style={listStyle}
                        renderItem={({ item, index }) => (
                            <View style={listContainer}>
                                <Text style={listTextStyle}>{item[STYLIST_FIRST_NAME] + ' ' + item[STYLIST_LAST_NAME]}</Text>
                                <Text style={numberInputStyle2}>{intToNumberCurrencyString(this.state.product.stylistsServices[item[STYLIST_ID]], 0)}</Text>
                            </View>
                        )}
                    />
                </ScrollView>
                <View style={buttonContainerStyle}>
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

export default connect(mapStateToProps, mapDispatchToProps)(InfoTreatmentScreen)
