import { combineReducers } from 'redux'

import BluetoothReducers from './BluetoothReducers'
import DatabaseReducers from './DatabaseReducers'
import ProductReducers from './ProductReducers'
import SaleReducers from './SaleReducers'
import StylistReducers from './StylistReducers'

export default combineReducers({
    bluetoothReducers: BluetoothReducers,
    databaseReducers: DatabaseReducers,
    productReducers: ProductReducers,
    saleReducers: SaleReducers,
    stylistReducers: StylistReducers
})
