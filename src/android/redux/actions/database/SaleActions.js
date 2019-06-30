import {
    createSaleTableQuery,
    deleteSaleQuery,
    insertSaleQuery,
    selectAllActiveSalePaidQuery,
    selectAllActiveSaleUnPaidQuery,
    updateSaleQuery
} from '../../../constants/database/sales'
import { UPDATE_SALE } from '../types'

export const createSaleTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleTableQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":0}
                    _callback({ saleTable: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ saleTable: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const insertSale = (db, sale, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertSaleQuery(sale), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1,"insertId":1}
                    _callback({
                        insertSale: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({ insertSale: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const updateSale = (db, sale, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(updateSaleQuery(sale), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1}
                    _callback({ updateSale: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ updateSale: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const deleteSale = (db, sale, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteSaleQuery(sale), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1}
                    _callback({ deleteSale: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ deleteSale: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const selectAllActiveSalePaid = (db, startDate, endDate, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllActiveSalePaidQuery(startDate, endDate, sort, order), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"stylist_id":2,"sale_id":11,"price":50000},{"stylist_id":4,"sale_id":11,"price":50000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        salesPaid: {
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
                salesPaid: {
                    _array: null,
                    length: 0,
                    startDate,
                    endDate
                }
            })
        },
        (success) => { }
    )
}

export const selectAllActiveSaleUnPaid = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllActiveSaleUnPaidQuery(sort, order), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"stylist_id":2,"sale_id":11,"price":50000},{"stylist_id":4,"sale_id":11,"price":50000}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        salesUnPaid: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                salesUnPaid: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const salesGot = (sales, salesLen) => ({
    type: UPDATE_SALE,
    payload: {
        sales,
        salesLen
    }
})
