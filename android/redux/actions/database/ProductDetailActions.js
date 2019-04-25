import { createProductDetailTableQuery } from '../../../constants/database/productsDetails'

export const createProductDetailTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createProductDetailTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ productDetailTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ productDetailTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
