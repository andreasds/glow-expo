import React, { Component } from 'react'
import { FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle } from '../../../constants/styles/employee'
import { iconStyle } from '../../../constants/styles/employee'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/employee'
import { modifyButtonContainerStyle, modifyButtonStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

class EmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    _onAddEmployeePressed() {
        const { navigate } = this.props.navigation
        navigate('AddEmployee')
    }

    _onEditEmployeePressed(stylist) {
        console.log('stylist = ' + JSON.stringify(stylist))
    }

    _onRemoveEmployeePressed(stylist) {
        console.log('stylist = ' + JSON.stringify(stylist))
    }

    render() {
        console.log('props = ' + JSON.stringify(this.props))
        console.log('state = ' + JSON.stringify(this.state))

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>LIST EMPLOYEES</Text>
                <FlatList
                    data={this.props.stylist.stylists}
                    keyExtractor={(stylistItem, stylistIndex) => stylistIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <View style={listContainer}>
                            <Text style={listTextStyle}>{item.first_name + ' ' + item.last_name}</Text>
                            <View style={modifyButtonContainerStyle}>
                                <TouchableHighlight
                                    onPress={() => this._onEditEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <FontAwesome color='white' name='pencil' size={30} style={iconStyle} />
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onRemoveEmployeePressed(item)}
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
                        onPress={() => this._onAddEmployeePressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <Text style={buttonTextStyle}>ADD EMPLOYEE</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { db } = state.databaseReducers
    const { stylists } = state.stylistReducers
    return {
        database: { db },
        stylist: { stylists }
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeScreen)
