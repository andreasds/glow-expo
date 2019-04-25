import { createStylistServiceTableQuery } from '../../../constants/database/stylistsServices'

export const createStylistServiceTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createStylistServiceTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ stylistServiceTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ stylistServiceTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
