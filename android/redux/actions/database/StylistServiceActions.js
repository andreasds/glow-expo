import {
    createStylistServiceTableQuery,
    insertStylistServiceQuery,
    selectAllStylistServiceByProductQuery,
    selectAllStylistServiceByStylistQuery,
    updateStylistServiceQuery
} from '../../../constants/database/stylistsServices'

export const createStylistServiceTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createStylistServiceTableQuery(), [],
                (_, success) => {
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
                    _callback({ stylistServiceTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ stylistServiceTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const insertStylistService = (db, stylistService, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertStylistServiceQuery(stylistService), [],
                (_, success) => {
                    // success = {"insertId":66,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertStylistService: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                },
                (error) => {
                    _callback({ insertStylistService: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const updateStylistService = (db, stylistService, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(updateStylistServiceQuery(stylistService), [],
                (_, success) => {
                    // success = {"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({ updateStylistService: { result: 'success' } })
                },
                (error) => {
                    _callback({ updateStylistService: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllStylistServiceByProduct = (db, product_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllStylistServiceByProductQuery(product_id), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":2,"product_id":11,"price":50000},{"stylist_id":4,"product_id":11,"price":50000}],"length":2}}
                    _callback({
                        stylistsServicesByProduct: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({ stylistsServicesByProduct: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllStylistServiceByStylist = (db, stylist_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllStylistServiceByStylistQuery(stylist_id), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":2,"product_id":11,"price":50000},{"stylist_id":4,"product_id":11,"price":50000}],"length":2}}
                    _callback({
                        stylistsServicesByStylist: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({ stylistsServicesByStylist: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
