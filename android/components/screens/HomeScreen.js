import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { connect } from 'react-redux'

class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' }}>
                <Text>HOME SCREEN</Text>
            </View>
        )
    }
}

export default connect()(HomeScreen)
