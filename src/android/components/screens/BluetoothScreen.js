import React, { Component } from 'react'
import { ActivityIndicator, FlatList, Switch, Text, TouchableHighlight, View } from 'react-native'
import { connect } from 'react-redux'

import {
    bluetoothDevicesGot,
    bluetoothDisabled,
    bluetoothEnabled,
    connectBluetooth,
    connectBluetoothPrinter,
    disableBluetooth,
    enableBluetooth,
    printerGot,
    scanBluetoothDevices
} from '../../redux/actions/BluetoothActions'

import { activityIndicatorStyle } from '../../constants/styles/bluetooth'
import { highlightButtonColor } from '../../constants/styles/bluetooth'
import { containerStyle } from '../../constants/styles/bluetooth'
import { lineStyle } from '../../constants/styles/bluetooth'
import { listContainer, listStyle } from '../../constants/styles/bluetooth'
import { miniTextStyle, textStyle } from '../../constants/styles/bluetooth'
import { titleTextStyle } from '../../constants/styles/bluetooth'
import { switchContainerStyle, switchStyle } from '../../constants/styles/bluetooth'

class BluetoothScreen extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)
        this.state = {
            loading: 0
        }

        this._reinitializeBluetooth = this._reinitializeBluetooth.bind(this)
    }

    _reinitializeBluetooth(_result) {
        for (let key in _result) {
            switch (key) {
                case 'disableBluetooth': {
                    if (_result[key].result) {
                        this.props.bluetoothDisabled()
                    }
                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'enableBluetooth': {
                    this.props.bluetoothEnabled()
                    this.props.bluetoothDevicesGot(this.props.bluetooth.found, _result[key].paired)

                    this.setState({ loading: this.state.loading + 1 })
                    scanBluetoothDevices(this._reinitializeBluetooth)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'scanBluetooth': {
                    this.props.bluetoothDevicesGot(
                        _result[key].found || this.props.bluetooth.found,
                        _result[key].paired || this.props.bluetooth.paired
                    )

                    this.setState({ loading: this.state.loading + 1 })
                    connectBluetoothPrinter(this.props.bluetooth.found, this.props.bluetooth.paired, this._reinitializeBluetooth)

                    this.setState({ loading: this.state.loading - 1 })
                    break
                }
                case 'connectBluetooth':
                case 'connectBluetoothPrinter': {
                    this.props.printerGot(_result[key].printer)
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

    render() {
        return (
            <View style={containerStyle}>
                <Text style={titleTextStyle}>BLUETOOTH</Text>
                <View style={switchContainerStyle}>
                    <Text style={textStyle}>
                        {this.props.bluetooth.printer ? this.props.bluetooth.printer.name : 'Not Connected'}
                    </Text>
                    <Switch
                        onValueChange={(on) => {
                            this.setState({ loading: this.state.loading + 1 })
                            if (!on) disableBluetooth(this._reinitializeBluetooth)
                            else enableBluetooth(this._reinitializeBluetooth)
                        }}
                        style={switchStyle}
                        value={this.props.bluetooth.isEnable} />
                </View>
                <View style={lineStyle} />
                {
                    this.state.loading ?
                        <ActivityIndicator style={activityIndicatorStyle} animating={true} size='large' color='white' /> :
                        null
                }
                <Text style={miniTextStyle}>Paired Devices</Text>
                <FlatList
                    data={this.props.bluetooth.paired}
                    keyExtractor={(pairedItem, pairedIndex) => pairedIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <TouchableHighlight
                            onPress={() => {
                                if (!this.state.loading) {
                                    this.setState({ loading: this.state.loading + 1 })
                                    connectBluetooth(item, this._reinitializeBluetooth)
                                }
                            }}
                            style={listContainer}
                            underlayColor={highlightButtonColor}>
                            <View>
                                <Text style={textStyle}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
                <View style={lineStyle} />
                <Text style={miniTextStyle}>Found Devices</Text>
                <FlatList
                    data={this.props.bluetooth.found}
                    keyExtractor={(foundItem, foundIndex) => foundIndex.toString()}
                    style={listStyle}
                    renderItem={({ item, index }) => (
                        <TouchableHighlight
                            onPress={() => {
                                if (!this.state.loading) {
                                    this.setState({ loading: this.state.loading + 1 })
                                    connectBluetooth(item, this._reinitializeBluetooth)
                                }
                            }}
                            style={listContainer}
                            underlayColor={highlightButtonColor}>
                            <View>
                                <Text style={textStyle}>{item.name}</Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
        )
    }
}

const mapStateToProps = state => {
    const { found, isEnable, paired, printer } = state.bluetoothReducers
    return {
        bluetooth: { found, isEnable, paired, printer }
    }
}

const mapDispatchToProps = dispatch => ({
    bluetoothDevicesGot: (found, paired) => dispatch(bluetoothDevicesGot(found, paired)),
    bluetoothDisabled: () => dispatch(bluetoothDisabled()),
    bluetoothEnabled: () => dispatch(bluetoothEnabled()),
    printerGot: (printer) => dispatch(printerGot(printer))
})

export default connect(mapStateToProps, mapDispatchToProps)(BluetoothScreen)
