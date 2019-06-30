import {
    createStylistServiceTableQuery,
    insertStylistServiceQuery,
    selectAllStylistServiceQuery,
    selectAllStylistServiceByProductQuery,
    selectAllStylistServiceByStylistQuery,
    updateStylistServiceQuery
} from '../../../constants/database/stylistsServices'

export const createStylistServiceTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createStylistServiceTableQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":0}
                    _callback({ stylistServiceTable: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ stylistServiceTable: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const insertStylistService = (db, stylistService, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertStylistServiceQuery(stylistService), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1,"insertId":1}
                    _callback({
                        insertStylistService: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({ insertStylistService: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const updateStylistService = (db, stylistService, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(updateStylistServiceQuery(stylistService), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1}
                    _callback({ updateStylistService: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ updateStylistService: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const selectAllStylistService = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllStylistServiceQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":5},"rowsAffected":0}
                    // _array = [{"stylist_id":1,"product_id":1,"price":25000},{"stylist_id":2,"product_id":1,"price":25000},{"stylist_id":3,"product_id":1,"price":25000},{"stylist_id":4,"product_id":1,"price":35000},{"stylist_id":5,"product_id":1,"price":35000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        stylistsServices: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                stylistsServices: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const selectAllStylistServiceByProduct = (db, product_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllStylistServiceByProductQuery(product_id), [],
                (_, success) => {
                    // success = {"rows":{"length":5},"rowsAffected":0}
                    // _array = [{"stylist_id":1,"product_id":1,"price":25000},{"stylist_id":2,"product_id":1,"price":25000},{"stylist_id":3,"product_id":1,"price":25000},{"stylist_id":4,"product_id":1,"price":35000},{"stylist_id":5,"product_id":1,"price":35000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        stylistsServicesByProduct: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                stylistsServicesByProduct: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const selectAllStylistServiceByStylist = (db, stylist_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllStylistServiceByStylistQuery(stylist_id), [],
                (_, success) => {
                    // success = {"rows":{"length":5},"rowsAffected":0}
                    // _array = [{"stylist_id":1,"product_id":1,"price":25000},{"stylist_id":2,"product_id":1,"price":25000},{"stylist_id":3,"product_id":1,"price":25000},{"stylist_id":4,"product_id":1,"price":35000},{"stylist_id":5,"product_id":1,"price":35000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        stylistsServicesByStylist: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                stylistsServicesByStylist: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}
