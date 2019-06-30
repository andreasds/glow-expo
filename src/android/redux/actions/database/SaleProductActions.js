import {
    createSaleProductTableQuery,
    deleteSaleProductQuery,
    insertSaleProductQuery,
    selectAllSaleProductBySaleQuery,
    summaryProductsQuery
} from '../../../constants/database/salesProducts'

export const createSaleProductTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleProductTableQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":0}
                    _callback({ saleProductTable: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ saleProductTable: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const insertSaleProduct = (db, saleProduct, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertSaleProductQuery(saleProduct), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1,"insertId":1}
                    _callback({
                        insertSaleProduct: {
                            result: 'success',
                            insertId: success.insertId,
                            saleProduct
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({ insertSaleProduct: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const deleteSaleProduct = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteSaleProductQuery(sale_id), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":3}
                    _callback({ deleteSaleProduct: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ deleteSaleProduct: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const selectAllSaleProductBySale = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllSaleProductBySaleQuery(sale_id), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"stylist_id":2,"sale_id":11,"price":50000},{"stylist_id":4,"sale_id":11,"price":50000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        saleProductBySale: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                saleProductBySale: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const summaryProducts = (db, startDate, endDate, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(summaryProductsQuery(startDate, endDate), [],
                (_, success) => {
                    // success = {"rows":{"length":4},"rowsAffected":0}
                    // _array = [{"count":1,"product_id":1,"name":"Gunting Cewe"},{"count":1,"product_id":3,"name":"Gunting Cowo"},{"count":1,"product_id":5,"name":"Highlight"},{"count":1,"product_id":6,"name":"Paket Cewe"}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        summaryProducts: {
                            _array,
                            length: success.rows.length,
                            startDate,
                            endDate
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                summaryProducts: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}
