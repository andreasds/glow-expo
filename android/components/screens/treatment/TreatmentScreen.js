import React, { Component } from 'react'
import { Alert, FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { CHILD_PRODUCT_ID } from '../../../constants/database/products'
import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE } from '../../../constants/database/productsDetails'
import { STYLIST_ID } from '../../../constants/database/stylists'
import { STYLISTS_SERVICES_PRICE } from '../../../constants/database/stylistsServices'

import { loadingScreen } from '../../../constants/LoadingScreen'

import { productsGot } from '../../../redux/actions/database/ProductDetailActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/treatment'
import { containerStyle } from '../../../constants/styles/treatment'
import { iconStyle } from '../../../constants/styles/treatment'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/treatment'
import { modifyButtonContainerStyle, modifyButtonStyle } from '../../../constants/styles/treatment'
import { titleTextStyle } from '../../../constants/styles/treatment'

import { selectAllPackageByParent } from '../../../redux/actions/database/ProductActions'
import { deleteProduct, selectAllActiveProduct } from '../../../redux/actions/database/ProductDetailActions'
import { selectAllStylistServiceByProduct } from '../../../redux/actions/database/StylistServiceActions'

class TreatmentScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0,
            product: {},
            result: '',
            error: ''
        }

        this._reinitializeTreatment = this._reinitializeTreatment.bind(this)
    }

    _reinitializeTreatment(_result) {
        for (let key in _result) {
            switch (key) {
                case 'stylistsServicesByProduct': {
                    let product = this.state.product
                    let stylistsServices = {}
                    for (i = 0; i < _result[key].length; i++) {
                        let stylistService = _result[key]._array[i]
                        stylistsServices[stylistService[STYLIST_ID]] = stylistService[STYLISTS_SERVICES_PRICE]
                    }
                    product.stylistsServices = stylistsServices
                    this.setState({
                        loading: this.state.loading - 1,
                        product
                    })

                    if (this.state.product[PRODUCT_PACKAGE] === 'Y') {
                        this.setState({ loading: this.state.loading + 1 })
                        selectAllPackageByParent(this.props.database.db, product[PRODUCT_ID], this._reinitializeTreatment)
                    } else {
                        const { navigate } = this.props.navigation
                        navigate('EditTreatment', {
                            mode: 'edit',
                            product
                        })
                    }
                    break
                }
                case 'packagesByParent': {
                    let product = this.state.product
                    let packageItem = {}
                    for (i = 0; i < _result[key].length; i++) {
                        let item = _result[key]._array[i]
                        packageItem[item[CHILD_PRODUCT_ID]] = 'Y'
                    }
                    product.packageItem = packageItem
                    this.setState({
                        loading: this.state.loading - 1,
                        product
                    })
                    const { navigate } = this.props.navigation
                    navigate('EditTreatment', {
                        mode: 'edit',
                        product
                    })
                    break
                }
                case 'deleteProduct': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({ loading: this.state.loading + 1 })
                        selectAllActiveProduct(this.props.database.db, PRODUCT_NAME, 'asc', this._reinitializeTreatment)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'products': {
                    let products = _result[key]
                    this.props.productsGot(products._array, products.length)
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

    _onAddTreatmentPressed() {
        const { navigate } = this.props.navigation
        navigate('AddTreatment', {
            mode: 'add'
        })
    }

    _onEditTreatmentPressed(product) {
        this.setState({
            loading: this.state.loading + 1,
            product
        })
        selectAllStylistServiceByProduct(this.props.database.db, product[PRODUCT_ID], this._reinitializeTreatment)
    }

    _onRemoveTreatmentPressed(product) {
        Alert.alert(
            '',
            'Are you sure you want to delete ' + product.name + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({
                            loading: this.state.loading + 1,
                            product,
                            result: ''
                        })
                        deleteProduct(this.props.database.db, product, this._reinitializeTreatment)
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ],
            { cancelable: true }
        )
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            if (this.state.result === '') {
                return loadingScreen('Delete ' + this.state.product.name + ' in database', '')
            } else if (this.state.result === 'error') {
                return loadingScreen('ERROR Delete ' + this.state.product.name + ' in database', this.state.error)
            } else {
                return loadingScreen('Updating list treatments', '')
            }
        }

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>TREATMENTS LIST</Text>
                <FlatList
                    data={this.props.product.products}
                    keyExtractor={(productItem, productIndex) => productIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <View style={listContainer}>
                            <Text style={listTextStyle}>{item[PRODUCT_NAME]}</Text>
                            <View style={modifyButtonContainerStyle}>
                                <TouchableHighlight
                                    onPress={() => this._onEditTreatmentPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='pencil' size={30} style={iconStyle} />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onRemoveTreatmentPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='remove' size={32} style={iconStyle} />
                                </TouchableHighlight>
                            </View>
                        </View>
                    )}
                />
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onAddTreatmentPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <Text style={buttonTextStyle}>ADD TREATMENT</Text>
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

const mapDispatchToProps = dispatch => ({
    productsGot: (products, productsLen) => dispatch(productsGot(products, productsLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(TreatmentScreen)
