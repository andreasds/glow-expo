import { combineReducers } from 'redux'

import DatabaseReducers from './DatabaseReducers'
import ProductReducers from './ProductReducers'
import SaleReducers from './SaleReducers'
import StylistReducers from './StylistReducers'

export default combineReducers({
    databaseReducers: DatabaseReducers,
    productReducers: ProductReducers,
    saleReducers: SaleReducers,
    stylistReducers: StylistReducers
})
