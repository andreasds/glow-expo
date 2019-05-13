import { createVersionTableQuery, getLastVersionQuery, insertCurrentVersionQuery } from '../../../constants/database/versions'

export const insertCurrentVersion = (db, version, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertCurrentVersionQuery(version), [],
                (_, success) => {
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
                    _callback({ currentVersion: { result: 'success' } })
                },
                (error) => {
                    _callback({ currentVersion: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const getLastVersion = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(getLastVersionQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = [{"version":"1.0.0","time_updated":"2019-04-25 08:41:03"}]
                    if (!_array.length) {
                        _callback({ lastVersion: null })
                    } else {
                        _callback({ lastVersion: _array[0] })
                    }
                },
                (error) => {
                    _callback({ lastVersion: null })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const createVersionTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createVersionTableQuery(), [],
                (_, { rows: { _array } }) => {
                    // _array = []
                    _callback({ versionTable: { result: 'success' } })
                },
                (error) => {
                    _callback({ versionTable: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
