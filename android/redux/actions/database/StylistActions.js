import { createStylistTableQuery } from '../../../constants/database/stylists'

export const createStylistTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createStylistTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ stylistTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ stylistTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
