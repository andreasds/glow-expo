import React, { Component } from 'react'
import { Alert, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { STYLIST_FIRST_NAME } from '../../../constants/database/stylists'

import { loadingScreen } from '../../../constants/LoadingScreen'

import { stylistsGot } from '../../../redux/actions/database/StylistActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle, scrollContainerStyle } from '../../../constants/styles/employee'
import { textStyle, textInputStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

import { insertStylist, selectAllStylist } from '../../../redux/actions/database/StylistActions'

class AddEmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            firstName: '',
            lastName: '',
            loading: 0,
            result: 'waiting',
            error: ''
        }

        this._reinitializeAddEmployee = this._reinitializeAddEmployee.bind(this)
    }

    _reinitializeAddEmployee(_result) {
        for (let key in _result) {
            switch (key) {
                case 'insertStylist': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({ loading: this.state.loading + 1 })
                        selectAllStylist(this.props.database.db, STYLIST_FIRST_NAME, 'asc', this._reinitializeAddEmployee)
                    } else if (_result[key].result === 'error') {
                        this.setState({
                            loading: this.state.loading + 1,
                            error: _result[key].error
                        })
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'stylists': {
                    let stylists = _result[key]
                    this.props.stylistsGot(stylists)
                    this.setState({ loading: this.state.loading - 1 })

                    const { goBack } = this.props.navigation
                    goBack()
                    break
                }
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    _onSaveButtonPressed() {
        if (this.state.firstName) {
            this.setState({ loading: this.state.loading + 1 })
            let stylist = {
                firstName: this.state.firstName,
                lastName: this.state.lastName
            }
            insertStylist(this.props.database.db, stylist, this._reinitializeAddEmployee)
        }
    }

    _onCancelButtonPressed() {
        Alert.alert(
            '',
            'Are you sure want to cancel?',
            [
                {
                    text: 'OK', onPress: () => {
                        const { goBack } = this.props.navigation
                        goBack()
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
            if (this.state.result === 'waiting') {
                return loadingScreen('Save new employee into database', '')
            } else if (this.state.result === 'error') {
                return loadingScreen('ERROR Save new employee into database', this.state.error)
            } else {
                return loadingScreen('Updating list employees', '')
            }
        }

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>CREATE NEW EMPLOYEE</Text>
                <ScrollView style={{ ...scrollContainerStyle }}>
                    <Text style={textStyle}>First Name *</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => this.setState({ firstName: text })}
                        style={textInputStyle}
                        placeholder='First Name'
                        value={this.state.firstName} />
                    <Text style={textStyle}>Last Name</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => this.setState({ lastName: text })}
                        style={textInputStyle}
                        placeholder='Last Name'
                        value={this.state.lastName} />
                </ScrollView>
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onSaveButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>SAVE</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => this._onCancelButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>CANCEL</Text>
                        </View>
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
    stylistsGot: (stylists) => dispatch(stylistsGot(stylists))
})

export default connect(mapStateToProps, mapDispatchToProps)(AddEmployeeScreen)
