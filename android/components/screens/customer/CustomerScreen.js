import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadingScreen } from '../../../constants/LoadingScreen'

class CustomerScreen extends Component {
    static navigationOptions = {
        header: null
    }

    render() {
        return loadingScreen('This is customer screen', '')
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerScreen)
