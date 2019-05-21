import {
    createStylistTableQuery,
    deleteStylistQuery,
    getStylistQuery,
    insertStylistQuery,
    selectAllStylistQuery,
    selectAllActiveStylistQuery,
    updateStylistQuery
} from '../../../constants/database/stylists'
import { UPDATE_STYLIST } from '../types'

export const createStylistTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createStylistTableQuery(), [],
                (_, success) => {
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
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

export const getStylist = (db, stylist, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(getStylistQuery(stylist), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":5,"first_name":"- Choose Employee -","last_name":"","active":"Y"}],"length":1}}
                    _callback({
                        stylist: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        stylist: {
                            _array: null,
                            length: 0
                        }
                    })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const insertStylist = (db, stylist, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertStylistQuery(stylist), [],
                (_, success) => {
                    // success = {"insertId":17,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertStylist: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
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

export const updateStylist = (db, stylist, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(updateStylistQuery(stylist), [],
                (_, success) => {
                    // success = {"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({ updateStylist: { result: 'success' } })
                },
                (error) => {
                    _callback({ updateStylist: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const deleteStylist = (db, stylist, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteStylistQuery(stylist), [],
                (_, success) => {
                    // success = {"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({ deleteStylist: { result: 'success' } })
                },
                (error) => {
                    _callback({ deleteStylist: { result: 'error', error } })
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
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":4,"first_name":"Anang","last_name":"Budi","active":"Y"},{"stylist_id":6,"first_name":"Ngok","last_name":"Tet","active":"Y"}],"length":2}}
                    _callback({
                        stylists: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        stylists: {
                            _array: null,
                            length: 0
                        }
                    })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllActiveStylist = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllActiveStylistQuery(sort, order), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":4,"first_name":"Anang","last_name":"Budi","active":"Y"},{"stylist_id":6,"first_name":"Ngok","last_name":"Tet","active":"Y"}],"length":2}}
                    _callback({
                        stylists: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        stylists: {
                            _array: null,
                            length: 0
                        }
                    })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const stylistsGot = (stylists, stylistsLen) => ({
    type: UPDATE_STYLIST,
    payload: {
        stylists,
        stylistsLen
    }
})
