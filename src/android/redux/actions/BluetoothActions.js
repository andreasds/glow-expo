import { BluetoothManager } from 'react-native-bluetooth-escpos-printer'

import { DISABLE_BLUETOOTH, ENABLE_BLUETOOTH, UPDATE_BLUETOOTH, UPDATE_PRINTER } from './types'

export const isBluetoothEnabled = (_callback) => {
    BluetoothManager.isBluetoothEnabled().then((enabled) => {
        _callback({ isBluetoothEnabled: { result: enabled } })
    }, (error) => {
        _callback({ isBluetoothEnabled: { result: 'error', error } })
    })
}

export const disableBluetooth = (_callback) => {
    BluetoothManager.disableBluetooth().then((result) => {
        _callback({ disableBluetooth: { result } })
    }, (error) => {
        console.log('error = ' + JSON.stringify(error))
        _callback({ disableBluetooth: { result: 'error', error } })
    })
}

export const enableBluetooth = (_callback) => {
    BluetoothManager.enableBluetooth().then((devices) => {
        let paired = []
        if (devices && devices.length > 0) {
            for (let i = 0; i < devices.length; i++) {
                try {
                    paired.push(JSON.parse(devices[i]))
                } catch (error) {
                    console.log('error = ' + JSON.stringify(error))
                }
            }
        }
        _callback({ enableBluetooth: { paired } })
    }, (error) => {
        console.log('error = ' + JSON.stringify(error))
        _callback({ enableBluetooth: { paired: null, error } })
    })
}

export const scanBluetoothDevices = (_callback) => {
    BluetoothManager.scanDevices().then((btDevices) => {
        let devices = JSON.parse(btDevices)
        _callback({
            scanBluetooth: {
                found: devices.found,
                paired: devices.paired
            }
        })
    }, (error) => {
        console.log('error = ' + JSON.stringify(error))
        _callback({
            scanBluetooth: {
                found: null,
                paired: null,
                error
            }
        })
    })
}

export const connectBluetooth = (device, _callback) => {
    BluetoothManager.connect(device.address).then((s) => {
        _callback({
            connectBluetooth: { printer: device }
        })
    }, (error) => {
        console.log('error = ' + JSON.stringify(error))
        _callback({
            connectBluetooth: {
                printer: null,
                error
            }
        })
    })
}

export const connectBluetoothPrinter = (found, paired, _callback) => {
    let printer = { name: 'BlueTooth Printer' }

    for (deviceIndex in found) {
        if (found[deviceIndex].name === printer.name) {
            printer.address = found[deviceIndex].address
        }
    }

    for (deviceIndex in paired) {
        if (paired[deviceIndex].name === printer.name) {
            printer.address = paired[deviceIndex].address
        }
    }

    BluetoothManager.connect(printer.address).then((s) => {
        _callback({
            connectBluetoothPrinter: { printer }
        })
    }, (error) => {
        console.log('error = ' + JSON.stringify(error))
        _callback({
            connectBluetoothPrinter: {
                printer: null,
                error
            }
        })
    })
}

export const bluetoothDisabled = () => ({
    type: DISABLE_BLUETOOTH,
    payload: {
        isEnable: false
    }
})

export const bluetoothEnabled = () => ({
    type: ENABLE_BLUETOOTH,
    payload: {
        isEnable: true
    }
})

export const bluetoothDevicesGot = (found, paired) => ({
    type: UPDATE_BLUETOOTH,
    payload: {
        found,
        paired
    }
})

export const printerGot = (printer) => ({
    type: UPDATE_PRINTER,
    payload: {
        printer
    }
})
