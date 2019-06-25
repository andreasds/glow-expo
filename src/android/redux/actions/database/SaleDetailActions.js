import {
    createSaleDetailTableQuery,
    deleteSaleDetailQuery,
    insertSaleDetailQuery,
    selectAllSaleDetailBySaleQuery,
    summaryStylistsQuery
} from '../../../constants/database/salesDetails'

export const createSaleDetailTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleDetailTableQuery(), [],
                (_, success) => {
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
                    _callback({ saleDetailTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ saleDetailTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const insertSaleDetail = (db, saleDetail, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertSaleDetailQuery(saleDetail), [],
                (_, success) => {
                    // success = {"insertId":1,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertSaleDetail: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                },
                (error) => {
                    _callback({ insertSaleDetail: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const deleteSaleDetail = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteSaleDetailQuery(sale_id), [],
                (_, success) => {
                    // success = {"rowsAffected":3,"rows":{"_array":[],"length":0}}
                    _callback({ deleteSaleDetail: { result: 'success' } })
                },
                (error) => {
                    _callback({ deleteSaleDetail: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllSaleDetailBySale = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllSaleDetailBySaleQuery(sale_id), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":2,"sale_id":11,"price":50000},{"stylist_id":4,"sale_id":11,"price":50000}],"length":2}}
                    _callback({
                        saleDetailBySale: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({ saleDetailBySale: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const summaryStylists = (db, startDate, endDate, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(summaryStylistsQuery(startDate, endDate), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"count":1,"package_id":5,"package_name":"Highlight","product_id":5,"product_name":"Highlight","stylist_id":3,"first_name":"Asep","last_name":"Samsudin"},{"count":1,"package_id":6,"package_name":"Paket Cewe","product_id":1,"product_name":"Gunting Cewe","stylist_id":2,"first_name":"Hahaha","last_name":"Hehehe"},{"count":1,"package_id":6,"package_name":"Paket Cewe","product_id":2,"product_name":"Cuci Blow","stylist_id":4,"first_name":"Ngok","last_name":"Tet"}],"length":3}}
                    _callback({
                        summaryStylists: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        summaryStylists: {
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
