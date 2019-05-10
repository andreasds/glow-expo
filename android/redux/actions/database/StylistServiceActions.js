import {
    createStylistServiceTableQuery,
    insertStylistServiceQuery,
    selectAllStylistServiceByProductQuery,
    updateStylistServiceQuery
} from '../../../constants/database/stylistsServices'

export const createStylistServiceTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            console.log('query = ' + JSON.stringify(createStylistServiceTableQuery()))
            tx.executeSql(createStylistServiceTableQuery(), [],
                (_, success) => {
                    // _array = []
                    console.log('success = ' + JSON.stringify(success))
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
                    _callback({ insertStylistService: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
