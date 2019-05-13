import React, { Component } from 'react'
import { Alert, BackHandler, CheckBox, FlatList, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE, PRODUCT_PRICE } from '../../../constants/database/productsDetails'
import { PARENT_PRODUCT_ID, CHILD_PRODUCT_ID } from '../../../constants/database/products'
import { STYLIST_FIRST_NAME, STYLIST_ID, STYLIST_LAST_NAME } from '../../../constants/database/stylists'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { intToNumberCurrencyString, numberCurrencyStringToInt } from '../../../constants/utils/number'

import { productsGot } from '../../../redux/actions/database/ProductDetailActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/treatment'
import { checkBoxContainerStyle, checkBoxContainerStyle2, containerStyle, scrollContainerStyle } from '../../../constants/styles/treatment'
import { checkBoxStyle } from '../../../constants/styles/treatment'
import { listContainer, listStyle2, listTextStyle } from '../../../constants/styles/treatment'
import { numberInputStyle, numberInputStyle2, textStyle, textInputStyle } from '../../../constants/styles/treatment'
import { titleTextStyle } from '../../../constants/styles/treatment'

import { insertPackage, deletePackage } from '../../../redux/actions/database/ProductActions'
import { insertProduct, selectAllActiveProduct, updateProduct } from '../../../redux/actions/database/ProductDetailActions'
import { insertStylistService, updateStylistService } from '../../../redux/actions/database/StylistServiceActions'

class ModifyTreatmentScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let mode = navigation.getParam('mode', '')
        let product = navigation.getParam('product', {})
        if (mode === 'add') {
            product.stylistsServices = {}
            product.packageItem = {}
        }

        let products = []
        for (i = 0; i < props.product.productsLen; i++) {
            if (props.product.products[i][PRODUCT_ID] !== product[PRODUCT_ID]) {
                products.push(props.product.products[i])
            }
        }

        this.state = {
            mode,
            product,
            products,
            loading: 0,
            result: '',
            error: ''
        }

        this._reinitializeModifyTreatment = this._reinitializeModifyTreatment.bind(this)
        this._onCancelButtonPressed = this._onCancelButtonPressed.bind(this)
    }

    _updateAllStylistsPrice(price) {
        let product = this.state.product
        let stylistsServices = product.stylistsServices
        this.props.stylist.stylists.map((stylist) => {
            stylistsServices[stylist[STYLIST_ID]] = price
        })
        product.stylistsServices = stylistsServices
        this.setState({ product })
    }

    _reinitializeModifyTreatment(_result) {
        for (let key in _result) {
            switch (key) {
                case 'insertProduct':
                case 'updateProduct': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        if (key === 'insertProduct') {
                            let product = this.state.product
                            product[PRODUCT_ID] = _result[key].insertId
                            this.setState({ product })
                        }

                        this.setState({ loading: this.state.loading + 1 })
                        deletePackage(this.props.database.db, this.state.product[PRODUCT_ID], this._reinitializeModifyTreatment)
                        if (this.state.product[PRODUCT_PACKAGE] === 'Y') {
                            for (let product_id in this.state.product.packageItem) {
                                if (this.state.product.packageItem[product_id] === 'Y') {
                                    let productPackage = {}
                                    productPackage[PARENT_PRODUCT_ID] = this.state.product[PRODUCT_ID]
                                    productPackage[CHILD_PRODUCT_ID] = parseInt(product_id)
                                    this.setState({ loading: this.state.loading + 1 })
                                    insertPackage(this.props.database.db, productPackage, this._reinitializeModifyTreatment)
                                }
                            }
                        }

                        this.setState({ loading: this.state.loading + this.props.stylist.stylistsLen })
                        let stylistsServices = this.state.product.stylistsServices
                        for (let stylist_id in stylistsServices) {
                            let stylistService = {
                                stylist_id: parseInt(stylist_id),
                                product_id: this.state.product[PRODUCT_ID],
                                price: stylistsServices[stylist_id]
                            }
                            if (key === 'insertProduct') {
                                insertStylistService(this.props.database.db, stylistService, this._reinitializeModifyTreatment)
                            } else if (key === 'updateProduct') {
                                updateStylistService(this.props.database.db, stylistService, this._reinitializeModifyTreatment)
                            }
                        }

                        this.setState({ loading: this.state.loading + 1 })
                        selectAllActiveProduct(this.props.database.db, PRODUCT_NAME, 'asc', this._reinitializeModifyTreatment)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'insertPackage': {
                    if (_result[key].result === 'error') {
                        console.log('ERROR Insert package = ' + JSON.stringify(_result[key].error))
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'deletePackage': {
                    if (_result[key].result === 'error') {
                        console.log('ERROR Delete package = ' + JSON.stringify(_result[key].error))
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
                case 'products': {
                    let products = _result[key]
                    this.props.productsGot(products._array, products.length)
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

    _onSaveButtonPressed() {
        if (this.state.product[PRODUCT_NAME]) {
            let product = this.state.product
            product[PRODUCT_NAME] = !product[PRODUCT_NAME] ? '' : product[PRODUCT_NAME].trim()
            if (!product[PRODUCT_PRICE]) product[PRODUCT_PRICE] = 0
            if (!product[PRODUCT_PACKAGE]) product[PRODUCT_PACKAGE] = 'N'
            if (Object.keys(product.stylistsServices).length !== this.props.stylist.stylistsLen) { this._updateAllStylistsPrice(product[PRODUCT_PRICE]) }
            this.setState({
                loading: this.state.loading + 1,
                product
            })

            if (this.state.mode === 'add') {
                insertProduct(this.props.database.db, this.state.product, this._reinitializeModifyTreatment)
            } else if (this.state.mode === 'edit') {
                updateProduct(this.props.database.db, this.state.product, this._reinitializeModifyTreatment)
            }
        } else {
            Alert.alert(
                '',
                'Treatment name cannot be empty!',
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
                    return loadingScreen('Save new treatment into database', '')
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('Update treatment into database', '')
                } else {
                    return loadingScreen('Unknown mode', '')
                }
            } else if (this.state.result === 'error') {
                if (this.state.mode === 'add') {
                    return loadingScreen('ERROR Save new treatment into database', this.state.error)
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('ERROR Update treatment into database', this.state.error)
                } else {
                    return loadingScreen('Unknown mode', this.state.error)
                }
            } else {
                return loadingScreen('Updating list treatments', '')
            }
        }

        return (
            <View style={containerStyle}>
                {
                    this.state.mode === 'add' ?
                        <Text style={titleTextStyle}>ADD TREATMENT</Text> :
                        this.state.mode === 'edit' ?
                            <Text style={titleTextStyle}>EDIT TREATMENT</Text> :
                            <Text style={titleTextStyle}>UNKNOWN MODE</Text>
                }
                <ScrollView style={scrollContainerStyle}>
                    <Text style={textStyle}>Treatment Name *</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => {
                            let product = this.state.product
                            product[PRODUCT_NAME] = text
                            this.setState({ product })
                        }}
                        selectTextOnFocus={true}
                        style={textInputStyle}
                        placeholder='Treatment Name'
                        value={this.state.product[PRODUCT_NAME]} />
                    <Text style={textStyle}>Price</Text>
                    <TextInput
                        keyboardType='numeric'
                        maxLength={11}
                        onChangeText={(text) => {
                            let product = this.state.product
                            product[PRODUCT_PRICE] = numberCurrencyStringToInt(text)
                            this.setState({ product })
                            this._updateAllStylistsPrice(product[PRODUCT_PRICE])
                        }}
                        selectTextOnFocus={true}
                        style={numberInputStyle}
                        placeholder='Price'
                        value={intToNumberCurrencyString(this.state.product[PRODUCT_PRICE], 0)} />
                    {
                        this.props.product.productsLen > 1 ?
                            <View style={checkBoxContainerStyle}>
                                <Text style={textStyle}>Package</Text>
                                <CheckBox
                                    onValueChange={() => {
                                        let product = this.state.product
                                        product[PRODUCT_PACKAGE] = product[PRODUCT_PACKAGE] === 'Y' ? 'N' : 'Y'
                                        this.setState({ product })
                                    }}
                                    style={checkBoxStyle}
                                    value={this.state.product[PRODUCT_PACKAGE] === 'Y' ? true : false}
                                />
                            </View> :
                            null
                    }
                    {
                        this.state.product[PRODUCT_PACKAGE] === 'Y' ?
                            <FlatList
                                data={this.state.products}
                                extraData={this.state}
                                keyExtractor={(productItem, productIndex) => productIndex.toString()}
                                style={listStyle2}
                                renderItem={({ item, index }) => (
                                    <View style={checkBoxContainerStyle2}>
                                        <CheckBox
                                            onValueChange={() => {
                                                let product = this.state.product
                                                let packageItem = product.packageItem
                                                packageItem[item[PRODUCT_ID]] = packageItem[item[PRODUCT_ID]] === 'Y' ? 'N' : 'Y'
                                                product.packageItem = packageItem
                                                this.setState({ product })
                                            }}
                                            style={checkBoxStyle}
                                            value={this.state.product.packageItem[item[PRODUCT_ID]] === 'Y' ? true : false}
                                        />
                                        <Text style={textStyle}>{item[PRODUCT_NAME]}</Text>
                                    </View>
                                )}
                            /> :
                            null
                    }
                    {
                        this.props.stylist.stylistsLen ?
                            <Text style={textStyle}>Employees</Text> :
                            null
                    }
                    <FlatList
                        data={this.props.stylist.stylists}
                        extraData={this.state}
                        keyExtractor={(stylistItem, stylistIndex) => stylistIndex.toString()}
                        style={listStyle2}
                        renderItem={({ item, index }) => (
                            <View style={listContainer}>
                                <Text style={listTextStyle}>{item[STYLIST_FIRST_NAME] + ' ' + item[STYLIST_LAST_NAME]}</Text>
                                <TextInput
                                    keyboardType='numeric'
                                    maxLength={11}
                                    onChangeText={(text) => {
                                        let product = this.state.product
                                        let stylistsServices = product.stylistsServices
                                        stylistsServices[item[STYLIST_ID]] = numberCurrencyStringToInt(text)
                                        product.stylistsServices = stylistsServices
                                        this.setState({ product })
                                    }}
                                    selectTextOnFocus={true}
                                    style={numberInputStyle2}
                                    placeholder='Price'
                                    value={intToNumberCurrencyString(this.state.product.stylistsServices[item[STYLIST_ID]], 0)} />
                            </View>
                        )}
                    />
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
    productsGot: (products, productsLen) => dispatch(productsGot(products, productsLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModifyTreatmentScreen)
