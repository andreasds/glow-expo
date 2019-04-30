import {
    createStylistTableQuery,
    insertStylistQuery,
    selectAllStylistQuery
} from '../../../constants/database/stylists'
import { UPDATE_STYLIST } from '../types'

export const createStylistTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createStylistTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ stylistTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ stylistTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const insertStylist = (db, stylist, _callback) => {
    console.log('query = ' + JSON.stringify(insertStylistQuery(stylist)))
    db.transaction(
        (tx) => {
            tx.executeSql(insertStylistQuery(stylist), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ insertStylist: { result: 'success' } })
                },
                (error) => {
                    _callback({ insertStylist: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllStylist = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllStylistQuery(sort, order), [],
                (_, { rows: { _array } }) => {
                    // _array = [{"stylist_id":1,"first_name":"Wewew","last_name":"Hahay","active":"Y"},{"stylist_id":2,"first_name":"Nguing","last_name":"Ndut","active":"Y"}]
                    _callback({ stylists: _array })
                },
                (error) => {
                    _callback({ stylists: null })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const stylistsGot = (stylists) => ({
    type: UPDATE_STYLIST,
    payload: {
        stylists
    }
})
