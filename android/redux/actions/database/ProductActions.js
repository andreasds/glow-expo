import {
    createProductTableQuery,
    deletePackageQuery,
    insertPackageQuery,
    selectAllPackageByParentQuery
} from '../../../constants/database/products'

export const createProductTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            console.log('query = ' + createProductTableQuery())
            tx.executeSql(createProductTableQuery(), [],
                (_, success) => {
                    // _array = []
                    console.log('success = ' + JSON.stringify(success))
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

export const insertPackage = (db, productPackage, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertPackageQuery(productPackage), [],
                (_, success) => {
                    // success = {"insertId":1,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertPackage: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                },
                (error) => {
                    _callback({ insertPackage: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const deletePackage = (db, parent_product_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deletePackageQuery(parent_product_id), [],
                (_, success) => {
                    // success = {"rowsAffected":2,"rows":{"_array":[],"length":0}}
                    _callback({ deletePackage: { result: 'success' } })
                },
                (error) => {
                    _callback({ deletePackage: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllPackageByParent = (db, parent_product_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllPackageByParentQuery(parent_product_id), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"parent_product_id":11,"child_product_id":1},{"parent_product_id":11,"child_product_id":4}],"length":2}}
                    _callback({
                        packagesByParent: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        stylists: {
                            _array: null,
                            length: 0
                        }
                    })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}
