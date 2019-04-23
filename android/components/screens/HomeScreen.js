import React, { Component } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { buttonStyle, highlightButtonColor } from '../../constants/styles/home'
import { containerStyle } from '../../constants/styles/home'

class HomeScreen extends Component {
    static navigationOptions = {
        header: null
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

export default connect()(HomeScreen)
