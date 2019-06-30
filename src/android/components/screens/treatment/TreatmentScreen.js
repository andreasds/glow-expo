import React, { Component } from 'react'
import { Alert, FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfo, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

import { CHILD_PRODUCT_ID } from '../../../constants/database/products'
import { PRODUCT_ID, PRODUCT_NAME, PRODUCT_PACKAGE, PRODUCT_PRICE } from '../../../constants/database/productsDetails'
import { STYLIST_ID } from '../../../constants/database/stylists'
import { STYLISTS_SERVICES_PRICE } from '../../../constants/database/stylistsServices'

import { loadingScreen } from '../../../constants/LoadingScreen'
import { intToNumberCurrencyString } from '../../../constants/utils/number'

import { productsGot } from '../../../redux/actions/database/ProductDetailActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/treatment'
import { containerStyle, containerStyle2 } from '../../../constants/styles/treatment'
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
            process: '',
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
                        switch (this.state.process) {
                            case 'info':
                            case 'edit':
                                let process = this.state.process
                                this.setState({ process: '' })
                                if (process === 'edit') {
                                    navigate('EditTreatment', {
                                        mode: 'edit',
                                        product: this.state.product
                                    })
                                } else {
                                    navigate('InfoTreatment', {
                                        product: this.state.product
                                    })
                                }
                                break
                            default:
                                this.setState({
                                    loading: this.state.loading + 1,
                                    error: 'Failed to ' + this.state.process + ' process at get stylist services'
                                })
                                break
                        }
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
                    switch (this.state.process) {
                        case 'info':
                        case 'edit':
                            let process = this.state.process
                            this.setState({ process: '' })
                            if (process === 'edit') {
                                navigate('EditTreatment', {
                                    mode: 'edit',
                                    product: this.state.product
                                })
                            } else {
                                navigate('InfoTreatment', {
                                    product: this.state.product
                                })
                            }
                            break
                        default:
                            this.setState({
                                loading: this.state.loading + 1,
                                error: 'Failed to ' + this.state.process + ' process at get package items'
                            })
                            break
                    }
                    break
                }
                case 'deleteProduct': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({
                            loading: this.state.loading + 1,
                            result: ''
                        })
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
                    this.setState({
                        loading: this.state.loading - 1,
                        product: {},
                        process: ''
                    })
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

    _onInfoTreatmentPressed(product) {
        this.setState({
            loading: this.state.loading + 1,
            product,
            process: 'info'
        })
        selectAllStylistServiceByProduct(this.props.database.db, product[PRODUCT_ID], this._reinitializeTreatment)
    }

    _onEditTreatmentPressed(product) {
        this.setState({
            loading: this.state.loading + 1,
            product,
            process: 'edit'
        })
        selectAllStylistServiceByProduct(this.props.database.db, product[PRODUCT_ID], this._reinitializeTreatment)
    }

    _onRemoveTreatmentPressed(product) {
        Alert.alert(
            '',
            'Are you sure you want to delete ' + product[PRODUCT_NAME] + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({
                            loading: this.state.loading + 1,
                            product,
                            process: 'delete',
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
            switch (this.state.process) {
                case 'info':
                case 'edit':
                    if (this.state.result === '') {
                        return loadingScreen('Get detail ' + this.state.product[PRODUCT_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Get detail ' + this.state.product[PRODUCT_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Get detail ' + this.state.product[PRODUCT_NAME] + ' in database', 'Unknown process in ' + this.state.process + ' data')
                    }
                case 'delete':
                    if (this.state.result === '') {
                        return loadingScreen('Delete ' + this.state.product[PRODUCT_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Delete ' + this.state.product[PRODUCT_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Delete ' + this.state.product[PRODUCT_NAME] + ' in database', 'Unknown process in delete data')
                    }
                default:
                    return loadingScreen('ERROR ' + this.state.process + ': product ' + this.state.product[PRODUCT_NAME], this.state.error)
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
                            <View style={containerStyle2}>
                                <Text style={listTextStyle}>{item[PRODUCT_NAME]}</Text>
                                <Text style={listTextStyle}>{'[ Rp ' + intToNumberCurrencyString(item[PRODUCT_PRICE], 0) + ',00 ]'}</Text>
                            </View>
                            <View style={modifyButtonContainerStyle}>
                                <TouchableHighlight
                                    onPress={() => this._onInfoTreatmentPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon color={'white'} icon={faInfo} size={26} />
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onEditTreatmentPressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon color={'white'} icon={faPencilAlt} size={26} />
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onRemoveTreatmentPressed(item)}
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
