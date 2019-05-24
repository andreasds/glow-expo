import {
    createSaleProductTableQuery,
    deleteSaleProductQuery,
    insertSaleProductQuery,
    selectAllSaleProductBySaleQuery
} from '../../../constants/database/salesProducts'

export const createSaleProductTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleProductTableQuery(), [],
                (_, success) => {
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
                    _callback({ saleProductTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ saleProductTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const insertSaleProduct = (db, saleProduct, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertSaleProductQuery(saleProduct), [],
                (_, success) => {
                    // success = {"insertId":1,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertSaleProduct: {
                            result: 'success',
                            insertId: success.insertId,
                            saleProduct
                        }
                    })
                },
                (error) => {
                    _callback({ insertSaleProduct: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const deleteSaleProduct = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteSaleProductQuery(sale_id), [],
                (_, success) => {
                    // success = {"rowsAffected":3,"rows":{"_array":[],"length":0}}
                    _callback({ deleteSaleProduct: { result: 'success' } })
                },
                (error) => {
                    _callback({ deleteSaleProduct: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllSaleProductBySale = (db, sale_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllSaleProductBySaleQuery(sale_id), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"stylist_id":2,"sale_id":11,"price":50000},{"stylist_id":4,"sale_id":11,"price":50000}],"length":2}}
                    _callback({
                        saleProductBySale: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({ saleProductBySale: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
