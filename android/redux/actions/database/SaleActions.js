import {
    createSaleTableQuery,
    insertSaleQuery
} from '../../../constants/database/sales'
import { UPDATE_SALE } from '../types'

export const createSaleTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleTableQuery(), [],
                (_, success) => {
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
                    _callback({ saleTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ saleTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const insertSale = (db, sale, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertSaleQuery(sale), [],
                (_, success) => {
                    // success = {"insertId":17,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertSale: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                },
                (error) => {
                    _callback({ insertSale: { result: 'error', error } })
                }
            )
        },
        (error) => { },
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
