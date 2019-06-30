import React, { Component } from 'react'
import { Alert, FlatList, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faInfo, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons'

import { PRODUCT_ID } from '../../../constants/database/productsDetails'
import { STYLIST_FIRST_NAME, STYLIST_ID } from '../../../constants/database/stylists'
import { STYLISTS_SERVICES_PRICE } from '../../../constants/database/stylistsServices'

import { loadingScreen } from '../../../constants/LoadingScreen'

import { stylistsGot } from '../../../redux/actions/database/StylistActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle } from '../../../constants/styles/employee'
import { listContainer, listStyle, listTextStyle } from '../../../constants/styles/employee'
import { modifyButtonContainerStyle, modifyButtonStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

import { deleteStylist, selectAllActiveStylist } from '../../../redux/actions/database/StylistActions'
import { selectAllStylistServiceByStylist } from '../../../redux/actions/database/StylistServiceActions'

class EmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0,
            stylist: {},
            process: '',
            result: '',
            error: ''
        }

        this._reinitializeEmployee = this._reinitializeEmployee.bind(this)
    }

    _reinitializeEmployee(_result) {
        for (let key in _result) {
            switch (key) {
                case 'stylistsServicesByStylist': {
                    let stylist = this.state.stylist
                    let stylistsServices = {}
                    for (i = 0; i < _result[key].length; i++) {
                        let stylistService = _result[key]._array[i]
                        stylistsServices[stylistService[PRODUCT_ID]] = stylistService[STYLISTS_SERVICES_PRICE]
                    }
                    stylist.stylistsServices = stylistsServices
                    this.setState({
                        loading: this.state.loading - 1,
                        stylist
                    })

                    const { navigate } = this.props.navigation
                    switch (this.state.process) {
                        case 'info':
                        case 'edit':
                            let process = this.state.process
                            this.setState({ process: '' })
                            if (process === 'edit') {
                                navigate('EditEmployee', {
                                    mode: 'edit',
                                    stylist: this.state.stylist
                                })
                            } else {
                                navigate('InfoEmployee', {
                                    stylist: this.state.stylist
                                })
                            }
                            break
                        default:
                            this.setState({
                                loading: this.state.loading + 1,
                                error: 'Failed to ' + this.state.process + ' process at get stylist services'
                            })
                            break
                    }
                    break
                }
                case 'deleteStylist': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({
                            loading: this.state.loading + 1,
                            result: ''
                        })
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
                    this.props.stylistsGot(stylists._array, stylists.length)
                    this.setState({
                        loading: this.state.loading - 1,
                        stylist: {},
                        process: ''
                    })
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

    _onInfoEmployeePressed(stylist) {
        this.setState({
            loading: this.state.loading + 1,
            stylist,
            process: 'info'
        })
        selectAllStylistServiceByStylist(this.props.database.db, stylist[STYLIST_ID], this._reinitializeEmployee)
    }

    _onEditEmployeePressed(stylist) {
        this.setState({
            loading: this.state.loading + 1,
            stylist,
            process: 'edit'
        })
        selectAllStylistServiceByStylist(this.props.database.db, stylist[STYLIST_ID], this._reinitializeEmployee)
    }

    _onRemoveEmployeePressed(stylist) {
        Alert.alert(
            '',
            'Are you sure you want to delete ' + stylist[STYLIST_FIRST_NAME] + '?',
            [
                {
                    text: 'OK', onPress: () => {
                        this.setState({
                            loading: this.state.loading + 1,
                            stylist,
                            process: 'delete',
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

    _filterListStylists() {
        let stylists = []
        for (stylistIndex in this.props.stylist.stylists) {
            if (this.props.stylist.stylists[stylistIndex][STYLIST_FIRST_NAME] !== '- Choose Employee -') {
                stylists.push(this.props.stylist.stylists[stylistIndex])
            }
        }
        return stylists
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            switch (this.state.process) {
                case 'info':
                case 'edit':
                    if (this.state.result === '') {
                        return loadingScreen('Get detail ' + this.state.stylist[STYLIST_FIRST_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Get detail ' + this.state.stylist[STYLIST_FIRST_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Get detail ' + this.state.stylist[STYLIST_FIRST_NAME] + ' in database', 'Unknown process in ' + this.state.process + ' data')
                    }
                case 'delete':
                    if (this.state.result === '') {
                        return loadingScreen('Delete ' + this.state.stylist[STYLIST_FIRST_NAME] + ' in database', '')
                    } else if (this.state.result === 'error') {
                        return loadingScreen('ERROR Delete ' + this.state.stylist[STYLIST_FIRST_NAME] + ' in database', this.state.error)
                    } else {
                        return loadingScreen('ERROR Delete ' + this.state.stylist[STYLIST_FIRST_NAME] + ' in database', 'Unknown process in delete data')
                    }
                default:
                    return loadingScreen('ERROR ' + this.state.process + ': employee ' + this.state.stylist[STYLIST_FIRST_NAME], this.state.error)
            }
        }

        let stylists = this._filterListStylists()
        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>EMPLOYEES LIST</Text>
                <FlatList
                    data={stylists}
                    keyExtractor={(stylistItem, stylistIndex) => stylistIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <View style={listContainer}>
                            <Text style={listTextStyle}>{item.first_name + ' ' + item.last_name}</Text>
                            <View style={modifyButtonContainerStyle}>
                                <TouchableHighlight
                                    onPress={() => this._onInfoEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon color={'white'} icon={faInfo} size={26} />
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onEditEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon color={'white'} icon={faPencilAlt} size={26} />
                                    </View>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    onPress={() => this._onRemoveEmployeePressed(item)}
                                    style={modifyButtonStyle}
                                    underlayColor={highlightButtonColor}>
                                    <View>
                                        <FontAwesomeIcon key={index} color={'white'} icon={faTimes} size={32} />
                                    </View>
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
    const { stylists, stylistsLen } = state.stylistReducers
    return {
        database: { db },
        stylist: { stylists, stylistsLen }
    }
}

const mapDispatchToProps = dispatch => ({
    stylistsGot: (stylists, stylistsLen) => dispatch(stylistsGot(stylists, stylistsLen))
})

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeScreen)
