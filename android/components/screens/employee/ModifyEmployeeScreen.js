import React, { Component } from 'react'
import { Alert, BackHandler, ScrollView, Text, TextInput, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import { STYLIST_FIRST_NAME } from '../../../constants/database/stylists'

import { loadingScreen } from '../../../constants/LoadingScreen'

import { stylistsGot } from '../../../redux/actions/database/StylistActions'

import { buttonContainerStyle, buttonStyle, buttonTextStyle, highlightButtonColor } from '../../../constants/styles/employee'
import { containerStyle, scrollContainerStyle } from '../../../constants/styles/employee'
import { textStyle, textInputStyle } from '../../../constants/styles/employee'
import { titleTextStyle } from '../../../constants/styles/employee'

import { insertStylist, selectAllActiveStylist } from '../../../redux/actions/database/StylistActions'

class ModifyEmployeeScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        const { navigation } = this.props
        let mode = navigation.getParam('mode', '')
        let stylist = navigation.getParam('stylist', {})
        this.state = {
            mode,
            stylist,
            loading: 0,
            result: '',
            error: ''
        }

        this._reinitializeAddEmployee = this._reinitializeAddEmployee.bind(this)
        this._onCancelButtonPressed = this._onCancelButtonPressed.bind(this)
    }

    _reinitializeAddEmployee(_result) {
        for (let key in _result) {
            switch (key) {
                case 'insertStylist': {
                    this.setState({ result: _result[key].result })
                    if (_result[key].result === 'success') {
                        this.setState({ loading: this.state.loading + 1 })
                        selectAllActiveStylist(this.props.database.db, STYLIST_FIRST_NAME, 'asc', this._reinitializeAddEmployee)
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

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this._onCancelButtonPressed)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this._onCancelButtonPressed)
    }

    _onSaveButtonPressed() {
        if (this.state.stylist.first_name) {
            this.setState({ loading: this.state.loading + 1 })
            if (this.state.mode === 'add') {
                insertStylist(this.props.database.db, this.state.stylist, this._reinitializeAddEmployee)
            } else if (this.state.mode === 'edit') {
            }
        } else {
            Alert.alert(
                '',
                'Nama depan tidak boleh kosong',
                [
                    {
                        text: 'OK', onPress: () => { }
                    }
                ],
                { cancelable: true }
            )
        }
    }

    _onCancelButtonPressed() {
        Alert.alert(
            '',
            this.state.mode === 'add' ?
                'Apakah anda batal menambah pegawai?' :
                this.state.mode === 'edit' ?
                    'Apakah anda batal edit pegawai?' :
                    'UNKNOWN MODE',
            [
                {
                    text: 'Ya', onPress: () => {
                        const { goBack } = this.props.navigation
                        goBack()
                    }
                },
                { text: 'Batal', style: 'cancel' }
            ],
            { cancelable: true }
        )
        return true
    }

    render() {
        // console.log('props = ' + JSON.stringify(this.props))
        // console.log('state = ' + JSON.stringify(this.state))

        if (this.state.loading) {
            if (this.state.result === '') {
                if (this.state.mode === 'add') {
                    return loadingScreen('Save new employee into database', '')
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('Update employee into database', '')
                } else {
                    return loadingScreen('Unknown mode', '')
                }
            } else if (this.state.result === 'error') {
                if (this.state.mode === 'add') {
                    return loadingScreen('ERROR Save new employee into database', this.state.error)
                } else if (this.state.mode === 'edit') {
                    return loadingScreen('ERROR Update employee into database', this.state.error)
                } else {
                    return loadingScreen('Unknown mode', this.state.error)
                }
            } else {
                return loadingScreen('Updating list employees', '')
            }
        }

        return (
            <View style={containerStyle}>
                {
                    this.state.mode === 'add' ?
                        <Text style={titleTextStyle}>TAMBAH PEGAWAI</Text> :
                        this.state.mode === 'edit' ?
                            <Text style={titleTextStyle}>EDIT PEGAWAI</Text> :
                            <Text style={titleTextStyle}>UNKNOWN MODE</Text>
                }
                <ScrollView style={{ ...scrollContainerStyle }}>
                    <Text style={textStyle}>Nama Depan *</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => {
                            let stylist = this.state.stylist
                            stylist.first_name = text
                            this.setState({ stylist })
                        }}
                        style={textInputStyle}
                        placeholder='First Name'
                        value={this.state.stylist.first_name} />
                    <Text style={textStyle}>Nama Belakang</Text>
                    <TextInput
                        maxLength={50}
                        onChangeText={(text) => {
                            let stylist = this.state.stylist
                            stylist.last_name = text
                            this.setState({ stylist })
                        }}
                        style={textInputStyle}
                        placeholder='Last Name'
                        value={this.state.stylist.last_name} />
                </ScrollView>
                <View style={buttonContainerStyle}>
                    <TouchableHighlight
                        onPress={() => this._onSaveButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>SIMPAN</Text>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight
                        onPress={() => this._onCancelButtonPressed()}
                        style={buttonStyle}
                        underlayColor={highlightButtonColor}>
                        <View>
                            <Text style={buttonTextStyle}>BATAL</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModifyEmployeeScreen)
