import { createProductTableQuery } from '../../../constants/database/products'

export const createProductTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createProductTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ productTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ productTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
