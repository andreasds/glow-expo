import React, { Component } from 'react'
import { Platform, StyleSheet, Text, View } from 'react-native'
import { connect } from 'react-redux'

const instructions = Platform.select({
    ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
    android:
        'Double tap R on your keyboard to reload,\n' +
        'Shake or press menu button for dev menu',
})

class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
    }

    render() {
        console.log('props = ' + JSON.stringify(this.props))
        console.log('state = ' + JSON.stringify(this.state))

        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>Welcome to Android React Native!</Text>
                <Text style={styles.instructions}>To get started, edit App.js</Text>
                <Text style={styles.instructions}>{instructions}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
})

const mapStateToProps = state => {
    const { isEnable } = state.bluetoothReducers
    const { db } = state.databaseReducers
    const { products, productsLen } = state.productReducers
    const { sales, salesLen } = state.saleReducers
    const { stylists, stylistsLen } = state.stylistReducers
    return {
        bluetooth: { isEnable },
        database: { db },
        product: { products, productsLen },
        sale: { sales, salesLen },
        stylist: { stylists, stylistsLen }
    }
}

const mapDispatchToProps = dispatch => ({
    // databaseOpened: (db) => dispatch(databaseOpened(db)),
    // productsGot: (products, productsLen) => dispatch(productsGot(products, productsLen)),
    // salesGot: (sales, salesLen) => dispatch(salesGot(sales, salesLen)),
    // stylistsGot: (stylists, stylistsLen) => dispatch(stylistsGot(stylists, stylistsLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)
