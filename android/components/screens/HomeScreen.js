import React, { Component } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { SQLite } from 'expo'
import { DATABASE_NAME } from '../../constants/database/config'

import { buttonStyle, highlightButtonColor } from '../../constants/styles/home'
import { containerStyle } from '../../constants/styles/home'

import { loadingScreen } from '../../constants/LoadingScreen'

import { databaseOpened } from '../../redux/actions/DatabaseActions'
import { createProductTable } from '../../redux/actions/database/ProductActions'
import { createProductDetailTable } from '../../redux/actions/database/ProductDetailActions'
import { createSaleTable } from '../../redux/actions/database/SaleActions'
import { createSaleDetailTable } from '../../redux/actions/database/SaleDetailActions'
import { createSaleProductTable } from '../../redux/actions/database/SaleProductActions'
import { createStylistTable } from '../../redux/actions/database/StylistActions'
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

        this._initializeDatabase = this._initializeDatabase.bind(this)
    }

    _initializeDatabase(_result) {
        for (let key in _result) {
            switch (key) {
                case 'lastVersion': {
                    // _result = {"lastVersion":{"version":"1.0.0","time_updated":"2019-04-25 08:41:03"}}
                    // compare version
                    let currentVersion = require('../../../app.json').expo.version
                    let lastVersion = _result[key]
                    if (!lastVersion) {
                        this.setState({ loading: this.state.loading + 8 })
                        createProductTable(this.props.database.db, this._initializeDatabase)
                        createProductDetailTable(this.props.database.db, this._initializeDatabase)
                        createSaleTable(this.props.database.db, this._initializeDatabase)
                        createSaleDetailTable(this.props.database.db, this._initializeDatabase)
                        createSaleProductTable(this.props.database.db, this._initializeDatabase)
                        createStylistTable(this.props.database.db, this._initializeDatabase)
                        createStylistServiceTable(this.props.database.db, this._initializeDatabase)
                        createVersionTable(this.props.database.db, this._initializeDatabase)
                    } else if (lastVersion.version !== currentVersion) {
                        // TODO: database modification
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
                    insertCurrentVersion(this.props.database.db, currentVersion, this._initializeDatabase)

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
            getLastVersion(db, this._initializeDatabase)

            this.props.databaseOpened(db)
        }
    }

    _onCustomerButtonPressed() {

    }

    _onEmployeeButtonPressed() {
        const { navigate } = this.props.navigation
        navigate('Employee')
    }

    _onTreatmentButtonPressed() {

    }

    _onPrinterButtonPressed() {

    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (!this.props.database.db || this.state.loading) {
            return loadingScreen
        }

        return (
            <View style={containerStyle}>
                <TouchableHighlight
                    onPress={() => this._onCustomerButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <View>
                        <Text>CUSTOMER</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onEmployeeButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <View>
                        <Text>EMPLOYEE</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onTreatmentButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <View>
                        <Text>TREATMENT</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onPrinterButtonPressed()}
                    style={buttonStyle}
                    underlayColor={highlightButtonColor}>
                    <View>
                        <Text>PRINTER</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    return {
        database: { db }
    }
}

const mapDispatchToProps = dispatch => ({
    databaseOpened: (db) => dispatch(databaseOpened(db))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
