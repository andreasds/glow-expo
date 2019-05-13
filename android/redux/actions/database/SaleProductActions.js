import { createSaleProductTableQuery } from '../../../constants/database/salesProducts'

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
