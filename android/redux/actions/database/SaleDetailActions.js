import {
    createSaleDetailTableQuery,
    deleteSaleDetailQuery,
    insertSaleDetailQuery
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
