import React, { Component } from 'react'
import { FlatList, ScrollView, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { PRODUCT_ID, PRODUCT_NAME } from '../../../constants/database/productsDetails'
import { STYLIST_FIRST_NAME, STYLIST_LAST_NAME } from '../../../constants/database/stylists'

import { intToNumberCurrencyString } from '../../../constants/utils/number'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle, scrollContainerStyle } from '../../../constants/styles/employee'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/employee'
import { numberInputStyle, textStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

class InfoEmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let stylist = navigation.getParam('stylist', {})

        this.state = {
            stylist,
            loading: 0,
            result: '',
            error: ''
        }
    }

    _onEditButtonPressed() {
        let stylist = this.state.stylist
        const { replace } = this.props.navigation
        replace('EditEmployee', {
            mode: 'edit',
            stylist
        })
    }

    _onBackButtonPressed() {
        const { goBack } = this.props.navigation
        goBack()
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>EMPLOYEE INFO</Text>
                <ScrollView style={scrollContainerStyle}>
                    <Text style={textStyle}>{this.state.stylist[STYLIST_FIRST_NAME] + ' ' + this.state.stylist[STYLIST_LAST_NAME]}</Text>
                    <FlatList
                        data={this.props.product.products}
                        extraData={this.state}
                        keyExtractor={(productItem, productIndex) => productIndex.toString()}
                        style={listStyle}
                        renderItem={({ item, index }) => (
                            <View style={listContainer}>
                                <Text style={listTextStyle}>{item[PRODUCT_NAME]}</Text>
                                <Text style={numberInputStyle}>{intToNumberCurrencyString(this.state.stylist.stylistsServices[item[PRODUCT_ID]], 0)}</Text>
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
    return {
        database: { db },
        product: { products, productsLen }
    }
}

const mapDispatchToProps = dispatch => ({})

export default connect(mapStateToProps, mapDispatchToProps)(InfoEmployeeScreen)
