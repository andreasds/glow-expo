import React, { Component } from 'react'
import { Alert, BackHandler, FlatList, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PRICE } from '../../../constants/database/productsDetails'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { intToNumberCurrencyString, numberCurrencyStringToInt } from '../../../constants/utils/number'

import { stylistsGot } from '../../../redux/actions/database/StylistActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle, scrollContainerStyle } from '../../../constants/styles/employee'
import { listContainer, listStyle2, listTextStyle } from '../../../constants/styles/employee'
import { numberInputStyle, textStyle, textInputStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

import { insertStylist, selectAllActiveStylist, updateStylist } from '../../../redux/actions/database/StylistActions'
import { insertStylistService, updateStylistService } from '../../../redux/actions/database/StylistServiceActions'

class ModifyEmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let mode = navigation.getParam('mode', '')
        let stylist = navigation.getParam('stylist', {})
        if (mode === 'add') {
            stylist.stylistsServices = {}
        }
        this.state = {
            mode,
            stylist,
            loading: 0,
            result: '',
            error: ''
        }

        this._reinitializeModifyEmployee = this._reinitializeModifyEmployee.bind(this)
        this._onCancelButtonPressed = this._onCancelButtonPressed.bind(this)
    }

    _resetAllProductsPrice() {
        let stylist = this.state.stylist
        let stylistsServices = stylist.stylistsServices
        let products = this.props.product.products
        for (let product_index in products) {
            stylistsServices[products[product_index][PRODUCT_ID]] = products[product_index][PRODUCT_PRICE]
        }
        stylist.stylistsServices = stylistsServices
        this.setState({ stylist })
    }

    _reinitializeModifyEmployee(_result) {
        for (let key in _result) {
            switch (key) {
                case 'insertStylist':
                case 'updateStylist': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        if (key === 'insertStylist') {
                            let stylist = this.state.stylist
                            stylist[STYLIST_ID] = _result[key].insertId
                            this.setState({ stylist })
                        }

                        this.setState({ loading: this.state.loading + this.props.product.productsLen })
                        let stylistsServices = this.state.stylist.stylistsServices
                        for (let product_id in stylistsServices) {
                            let stylistService = {
                                product_id: parseInt(product_id),
                                stylist_id: this.state.stylist[STYLIST_ID],
                                price: stylistsServices[product_id]
                            }
                            if (key === 'insertStylist') {
                                insertStylistService(this.props.database.db, stylistService, this._reinitializeModifyEmployee)
                            } else if (key === 'updateStylist') {
                                updateStylistService(this.props.database.db, stylistService, this._reinitializeModifyEmployee)
                            }
                        }

                        this.setState({ loading: this.state.loading + 1 })
                        selectAllActiveStylist(this.props.database.db, STYLIST_FIRST_NAME, 'asc', this._reinitializeModifyEmployee)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'insertStylistService': {
                    if (_result[key].result === 'error') {
                        console.log('ERROR Insert stylist service = ' + JSON.stringify(_result[key].error))
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'updateStylistService': {
                    if (_result[key].result === 'error') {
                        console.log('ERROR Update stylist service = ' + JSON.stringify(_result[key].error))
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'stylists': {
                    let stylists = _result[key]
                    this.props.stylistsGot(stylists._array, stylists.length)
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
        if (this.state.mode === 'add') {
            this._resetAllProductsPrice()
        }

        BackHandler.addEventListener('hardwareBackPress', this._onCancelButtonPressed)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onCancelButtonPressed)
    }

    _onResetButtonPressed() {
        Alert.alert(
            '',
            'Are you sure you want to reset all price?',
            [
                {
                    text: 'OK', onPress: () => {
                        this._resetAllProductsPrice()
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    _onSaveButtonPressed() {
        if (this.state.stylist.first_name) {
            let stylist = this.state.stylist
            stylist.first_name = !stylist.first_name ? '' : stylist.first_name.trim()
            stylist.last_name = !stylist.last_name ? '' : stylist.last_name.trim()
            this.setState({
                loading: this.state.loading + 1,
                stylist
            })

            if (this.state.mode === 'add') {
                insertStylist(this.props.database.db, this.state.stylist, this._reinitializeModifyEmployee)
            } else if (this.state.mode === 'edit') {
                updateStylist(this.props.database.db, this.state.stylist, this._reinitializeModifyEmployee)
            }
        } else {
            Alert.alert(
                '',
                'First name cannot be empty!',
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

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            if (this.state.result === '') {
                if (this.state.mode === 'add') {
                    return loadingScreen('Save new employee into database', '')
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('Update employee into database', '')
                } else {
                    return loadingScreen('Unknown mode', '')
                }
            } else if (this.state.result === 'error') {
                if (this.state.mode === 'add') {
                    return loadingScreen('ERROR Save new employee into database', this.state.error)
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('ERROR Update employee into database', this.state.error)
                } else {
                    return loadingScreen('Unknown mode', this.state.error)
                }
            } else {
                return loadingScreen('Updating list employees', '')
            }
        }

        return (
            <View style={containerStyle}>
                {
                    this.state.mode === 'add' ?
                        <Text style={titleTextStyle}>ADD EMPLOYEE</Text> :
                        this.state.mode === 'edit' ?
                            <Text style={titleTextStyle}>EDIT EMPLOYEE</Text> :
                            <Text style={titleTextStyle}>UNKNOWN MODE</Text>
                }
                <ScrollView style={scrollContainerStyle}>
                    <Text style={textStyle}>First Name *</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => {
                            let stylist = this.state.stylist
                            stylist[STYLIST_FIRST_NAME] = text
                            this.setState({ stylist })
                        }}
                        selectTextOnFocus={true}
                        style={textInputStyle}
                        placeholder='First Name'
                        value={this.state.stylist[STYLIST_FIRST_NAME]} />
                    <Text style={textStyle}>Last Name</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => {
                            let stylist = this.state.stylist
                            stylist[STYLIST_LAST_NAME] = text
                            this.setState({ stylist })
                        }}
                        selectTextOnFocus={true}
                        style={textInputStyle}
                        placeholder='Last Name'
                        value={this.state.stylist[STYLIST_LAST_NAME]} />
                    {
                        this.props.product.productsLen ?
                            <Text style={textStyle}>Treatment</Text> :
                            null
                    }
                    <FlatList
                        data={this.props.product.products}
                        extraData={this.state}
                        keyExtractor={(productItem, productIndex) => productIndex.toString()}
                        style={listStyle2}
                        renderItem={({ item, index }) => (
                            <View style={listContainer}>
                                <Text style={listTextStyle}>{item[PRODUCT_NAME]}</Text>
                                <TextInput
                                    keyboardType='numeric'
                                    maxLength={11}
                                    onChangeText={(text) => {
                                        let stylist = this.state.stylist
                                        let stylistsServices = stylist.stylistsServices
                                        stylistsServices[item[PRODUCT_ID]] = numberCurrencyStringToInt(text)
                                        stylist.stylistsServices = stylistsServices
                                        this.setState({ stylist })
                                    }}
                                    selectTextOnFocus={true}
                                    style={numberInputStyle}
                                    placeholder='Price'
                                    value={intToNumberCurrencyString(this.state.stylist.stylistsServices[item[PRODUCT_ID]], 0)} />
                            </View>
                        )}
                    />
                    {
                        this.props.product.productsLen ?
                            <TouchableHighlight
                                onPress={() => this._onResetButtonPressed()}
                                style={buttonStyle}
                                underlayColor={highlightButtonColor}>
                                <View>
                                    <Text style={buttonTextStyle}>RESET PRICE</Text>
                                </View>
                            </TouchableHighlight> :
                            null
                    }
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
    stylistsGot: (stylists, stylistsLen) => dispatch(stylistsGot(stylists, stylistsLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModifyEmployeeScreen)
