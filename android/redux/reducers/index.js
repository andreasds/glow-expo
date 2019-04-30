import { combineReducers } from 'redux'

import DatabaseReducers from './DatabaseReducers'
import StylistReducers from './StylistReducers'

export default combineReducers({
    databaseReducers: DatabaseReducers,
    stylistReducers: StylistReducers
})
