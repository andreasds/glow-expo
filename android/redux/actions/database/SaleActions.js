import { createSaleTableQuery } from '../../../constants/database/sales'

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
