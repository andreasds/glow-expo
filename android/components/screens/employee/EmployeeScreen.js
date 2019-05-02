import React, { Component } from 'react'
import { Alert, FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesome } from '@expo/vector-icons'

import { STYLIST_FIRST_NAME } from '../../../constants/database/stylists'

import { loadingScreen } from '../../../constants/LoadingScreen'

import { stylistsGot } from '../../../redux/actions/database/StylistActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle } from '../../../constants/styles/employee'
import { iconStyle } from '../../../constants/styles/employee'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/employee'
import { modifyButtonContainerStyle, modifyButtonStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

import { deleteStylist, selectAllActiveStylist } from '../../../redux/actions/database/StylistActions'

class EmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0,
            stylist: {},
            result: '',
            error: ''
        }

        this._reinitializeEmployee = this._reinitializeEmployee.bind(this)
    }

    _reinitializeEmployee(_result) {
        for (let key in _result) {
            switch (key) {
                case 'deleteStylist': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({ loading: this.state.loading + 1 })
                        selectAllActiveStylist(this.props.database.db, STYLIST_FIRST_NAME, 'asc', this._reinitializeEmployee)
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
                    break
                }
                default: {
                    console.log('Unprocessed _result[\'' + key + '\'] = ' + JSON.stringify(_result[key]))
                    break
                }
            }
        }
    }

    _onAddEmployeePressed() {
        const { navigate } = this.props.navigation
        navigate('AddEmployee', {
            mode: 'add'
        })
    }

    _onEditEmployeePressed(stylist) {
        const { navigate } = this.props.navigation
        navigate('EditEmployee', {
            mode: 'edit',
            stylist
        })
    }

    _onRemoveEmployeePressed(stylist) {
        Alert.alert(
            '',
            'Are you sure you want to delete ' + stylist.first_name + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({
                            loading: this.state.loading + 1,
                            stylist,
                            result: ''
                        })
                        deleteStylist(this.props.database.db, stylist, this._reinitializeEmployee)
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
            if (this.state.result === '') {
                return loadingScreen('Delete ' + this.state.stylist.first_name + ' in database', '')
            } else if (this.state.result === 'error') {
                return loadingScreen('ERROR Delete ' + this.state.stylist.first_name + ' in database', this.state.error)
            } else {
                return loadingScreen('Updating list employees', '')
            }
        }

        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>EMPLOYEES LIST</Text>
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
    stylistsGot: (stylists) => dispatch(stylistsGot(stylists))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeScreen)
