import { createSaleTableQuery } from '../../../constants/database/sales'

export const createSaleTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
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
