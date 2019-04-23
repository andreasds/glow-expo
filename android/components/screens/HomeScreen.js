import React, { Component } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { containerStyle, touchableHighlightStyle } from '../../constants/styles/home'

class HomeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    _onCustomerButtonPressed() {

    }

    _onEmployeeButtonPressed() {

    }

    _onTreatmentButtonPressed() {

    }

    _onPrinterButtonPressed() {

    }

    render() {
        return (
            <View style={containerStyle}>
                <TouchableHighlight
                    onPress={() => this._onCustomerButtonPressed()}
                    style={touchableHighlightStyle}
                    underlayColor='darkgrey'>
                    <View>
                        <Text>CUSTOMER</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onEmployeeButtonPressed()}
                    style={touchableHighlightStyle}
                    underlayColor='darkgrey'>
                    <View>
                        <Text>EMPLOYEE</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onTreatmentButtonPressed()}
                    style={touchableHighlightStyle}
                    underlayColor='darkgrey'>
                    <View>
                        <Text>TREATMENT</Text>
                    </View>
                </TouchableHighlight>
                <TouchableHighlight
                    onPress={() => this._onPrinterButtonPressed()}
                    style={touchableHighlightStyle}
                    underlayColor='darkgrey'>
                    <View>
                        <Text>PRINTER</Text>
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}

export default connect()(HomeScreen)
