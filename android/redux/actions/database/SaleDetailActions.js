import { createSaleDetailTableQuery } from '../../../constants/database/salesDetails'

export const createSaleDetailTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleDetailTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
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
