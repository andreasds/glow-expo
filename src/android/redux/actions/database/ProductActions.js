import {
    createProductTableQuery,
    deletePackageQuery,
    insertPackageQuery,
    selectAllPackageQuery,
    selectAllPackageByParentQuery
} from '../../../constants/database/products'

export const createProductTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createProductTableQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":0}
                    _callback({ productTable: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ productTable: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const insertPackage = (db, productPackage, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertPackageQuery(productPackage), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1,"insertId":1}
                    _callback({
                        insertPackage: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({ insertPackage: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const deletePackage = (db, parent_product_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deletePackageQuery(parent_product_id), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":2}
                    _callback({ deletePackage: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ deletePackage: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const selectAllPackage = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllPackageQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":4},"rowsAffected":0}
                    // _array = [{"parent_product_id":4,"child_product_id":2},{"parent_product_id":4,"child_product_id":3},{"parent_product_id":5,"child_product_id":1},{"parent_product_id":5,"child_product_id":3}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        packages: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                packages: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const selectAllPackageByParent = (db, parent_product_id, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllPackageByParentQuery(parent_product_id), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"parent_product_id":11,"child_product_id":1},{"parent_product_id":11,"child_product_id":4}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        packagesByParent: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                packagesByParent: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}
