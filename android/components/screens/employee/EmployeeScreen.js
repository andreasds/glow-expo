import React, { Component } from 'react'
import { Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

class EmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    _onAddEmployeePressed() {

    }

    render() {
        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>LIST EMPLOYEES</Text>
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onAddEmployeePressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>ADD EMPLOYEE</Text>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

export default connect()(EmployeeScreen)
