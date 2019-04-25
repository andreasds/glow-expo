import { createSaleProductTableQuery } from '../../../constants/database/salesProducts'

export const createSaleProductTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createSaleProductTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
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
