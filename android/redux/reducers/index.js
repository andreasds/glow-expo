import { combineReducers } from 'redux'

import DatabaseReducers from './DatabaseReducers'
import ProductReducers from './ProductReducers'
import StylistReducers from './StylistReducers'

export default combineReducers({
    databaseReducers: DatabaseReducers,
    productReducers: ProductReducers,
    stylistReducers: StylistReducers
})
