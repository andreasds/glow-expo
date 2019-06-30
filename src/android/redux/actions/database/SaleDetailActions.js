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
                    // success = {"rows":{"length":0},"rowsAffected":0}
                    _callback({ saleDetailTable: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ saleDetailTable: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const insertSaleDetail = (db, saleDetail, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertSaleDetailQuery(saleDetail), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1,"insertId":1}
                    _callback({
                        insertSaleDetail: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({ insertSaleDetail: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const deleteSaleDetail = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteSaleDetailQuery(sale_id), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":3}
                    _callback({ deleteSaleDetail: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ deleteSaleDetail: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const selectAllSaleDetailBySale = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllSaleDetailBySaleQuery(sale_id), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"stylist_id":2,"sale_id":11,"price":50000},{"stylist_id":4,"sale_id":11,"price":50000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        saleDetailBySale: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                saleDetailBySale: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const summaryStylists = (db, startDate, endDate, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(summaryStylistsQuery(startDate, endDate), [],
                (_, success) => {
                    // success = {"rows":{"length":3},"rowsAffected":0}
                    // _array = [{"count":1,"package_id":5,"package_name":"Highlight","product_id":5,"product_name":"Highlight","stylist_id":3,"first_name":"Asep","last_name":"Samsudin"},{"count":1,"package_id":6,"package_name":"Paket Cewe","product_id":1,"product_name":"Gunting Cewe","stylist_id":2,"first_name":"Hahaha","last_name":"Hehehe"},{"count":1,"package_id":6,"package_name":"Paket Cewe","product_id":2,"product_name":"Cuci Blow","stylist_id":4,"first_name":"Ngok","last_name":"Tet"}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        summaryStylists: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                summaryStylists: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}
