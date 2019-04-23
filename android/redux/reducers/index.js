import { combineReducers } from 'redux'

import DatabaseReducers from './DatabaseReducers'

export default combineReducers({
    databaseReducers: DatabaseReducers
})
