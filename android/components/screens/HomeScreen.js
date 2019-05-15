import React, { Component } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { SQLite } from 'expo'
import { DATABASE_NAME } from '../../constants/database/config'
import { STYLIST_FIRST_NAME } from '../../constants/database/stylists'
import { PRODUCT_NAME } from '../../constants/database/productsDetails'

import { buttonStyle, buttonTextStyle, highlightButtonColor } from '../../constants/styles/home'
import { containerStyle } from '../../constants/styles/home'

import { loadingScreen } from '../../constants/LoadingScreen'

import { databaseOpened } from '../../redux/actions/DatabaseActions'
import { stylistsGot } from '../../redux/actions/database/StylistActions'
import { productsGot } from '../../redux/actions/database/ProductDetailActions'

import { createProductTable } from '../../redux/actions/database/ProductActions'
import { createProductDetailTable, selectAllActiveProduct } from '../../redux/actions/database/ProductDetailActions'
import { createSaleTable } from '../../redux/actions/database/SaleActions'
import { createSaleDetailTable } from '../../redux/actions/database/SaleDetailActions'
import { createSaleProductTable } from '../../redux/actions/database/SaleProductActions'
import { createStylistTable, selectAllActiveStylist } from '../../redux/actions/database/StylistActions'
import { createStylistServiceTable } from '../../redux/actions/database/StylistServiceActions'
import { createVersionTable, getLastVersion, insertCurrentVersion } from '../../redux/actions/database/VersionActions'

class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0
        }

        this._reinitializeHome = this._reinitializeHome.bind(this)
    }

    _reinitializeHome(_result) {
        for (let key in _result) {
            switch (key) {
                case 'lastVersion': {
                    // _result = {"lastVersion":{"version":"1.0.0","time_updated":"2019-04-25 08:41:03"}}
                    // compare version
                    let currentVersion = require('../../../app.json').expo.version
                    let lastVersion = _result[key]
                    if (!lastVersion) {
                        this.setState({ loading: this.state.loading + 8 })
                        createProductTable(this.props.database.db, this._reinitializeHome)
                        createProductDetailTable(this.props.database.db, this._reinitializeHome)
                        createSaleTable(this.props.database.db, this._reinitializeHome)
                        createSaleDetailTable(this.props.database.db, this._reinitializeHome)
                        createSaleProductTable(this.props.database.db, this._reinitializeHome)
                        createStylistTable(this.props.database.db, this._reinitializeHome)
                        createStylistServiceTable(this.props.database.db, this._reinitializeHome)
                        createVersionTable(this.props.database.db, this._reinitializeHome)
                    } else if (lastVersion.version !== currentVersion) {
                        // TODO: database modification
                    } else {
                        this.setState({ loading: this.state.loading + 2 })
                        selectAllActiveProduct(this.props.database.db, PRODUCT_NAME, 'asc', this._reinitializeHome)
                        selectAllActiveStylist(this.props.database.db, STYLIST_FIRST_NAME, 'asc', this._reinitializeHome)
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'currentVersion': {
                    console.log('Update current version ' + JSON.stringify(_result[key].result))
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'productTable': {
                    console.log('Create product table ' + JSON.stringify(_result[key].result))
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'productDetailTable': {
                    console.log('Create product detail table ' + JSON.stringify(_result[key].result))

                    this.setState({ loading: this.state.loading + 1 })
                    selectAllActiveProduct(this.props.database.db, PRODUCT_NAME, 'asc', this._reinitializeHome)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'saleTable': {
                    console.log('Create sale table ' + JSON.stringify(_result[key].result))
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'saleDetailTable': {
                    console.log('Create sale detail table ' + JSON.stringify(_result[key].result))
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'saleProductTable': {
                    console.log('Create sale product table ' + JSON.stringify(_result[key].result))
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'stylistTable': {
                    console.log('Create stylist table ' + JSON.stringify(_result[key].result))

                    this.setState({ loading: this.state.loading + 1 })
                    selectAllActiveStylist(this.props.database.db, STYLIST_FIRST_NAME, 'asc', this._reinitializeHome)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'stylistServiceTable': {
                    console.log('Create stylist service table ' + JSON.stringify(_result[key].result))
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'versionTable': {
                    console.log('Create version table ' + JSON.stringify(_result[key].result))

                    this.setState({ loading: this.state.loading + 1 })
                    let currentVersion = require('../../../app.json').expo.version
                    insertCurrentVersion(this.props.database.db, currentVersion, this._reinitializeHome)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'products': {
                    let products = _result[key]
                    this.props.productsGot(products._array, products.length)
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'stylists': {
                    let stylists = _result[key]
                    this.props.stylistsGot(stylists._array, stylists.length)
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

    componentDidMount() {
        if (!this.props.database.db) {
            const db = SQLite.openDatabase(DATABASE_NAME)

            // check last version
            this.setState({ loading: this.state.loading + 1 })
            getLastVersion(db, this._reinitializeHome)

            this.props.databaseOpened(db)
        }
    }

    _onCustomerButtonPressed() {
        const { navigate } = this.props.navigation
        navigate('Customer')
    }

    _onEmployeeButtonPressed() {
        const { navigate } = this.props.navigation
        navigate('Employee')
    }

    _onTreatmentButtonPressed() {
        const { navigate } = this.props.navigation
        navigate('Treatment')
    }

    _onPrinterButtonPressed() {

    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (!this.props.database.db ||
            this.state.loading ||
            !this.props.product.products ||
            !this.props.stylist.stylists) {
            if (!this.props.database.db) {
                return loadingScreen('Reading database', '')
            } else if (!this.props.product.products) {
                if (this.state.loading) {
                    return loadingScreen('Reading treatments', '')
                } else {
                    return loadingScreen('ERROR: Reading treatments', '')
                }
            } else if (!this.props.stylist.stylists) {
                if (this.state.loading) {
                    return loadingScreen('Reading stylists', '')
                } else {
                    return loadingScreen('ERROR: Reading stylists', '')
                }
            } else {
                return loadingScreen('Reading database', '')
            }
        }

        return (
            <View style={containerStyle}>
                <TouchableHighlight
                    onPress={() => this._onCustomerButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <Text style={buttonTextStyle}>CUSTOMER</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onEmployeeButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <Text style={buttonTextStyle}>EMPLOYEE</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onTreatmentButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <Text style={buttonTextStyle}>TREATMENT</Text>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onPrinterButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <Text style={buttonTextStyle}>PRINTER</Text>
                </TouchableHighlight>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
