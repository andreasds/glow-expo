import {
    createProductDetailTableQuery,
    deleteProductQuery,
    insertProductQuery,
    selectAllProductQuery,
    selectAllActiveProductQuery,
    updateProductQuery
} from '../../../constants/database/productsDetails'
import { UPDATE_PRODUCT } from '../types'

export const createProductDetailTable = (db, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(createProductDetailTableQuery(), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":0}
                    _callback({ productDetailTable: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ productDetailTable: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const insertProduct = (db, product, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertProductQuery(product), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1,"insertId":11}
                    _callback({
                        insertProduct: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({ insertProduct: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const updateProduct = (db, product, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(updateProductQuery(product), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1}
                    _callback({ updateProduct: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ updateProduct: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const deleteProduct = (db, product, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteProductQuery(product), [],
                (_, success) => {
                    // success = {"rows":{"length":0},"rowsAffected":1}
                    _callback({ deleteProduct: { result: 'success' } })
                }
            )
        },
        (error) => {
            _callback({ deleteProduct: { result: 'error', error } })
        },
        (success) => { }
    )
}

export const selectAllProduct = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllProductQuery(sort, order), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"stylist_id":4,"first_name":"Anang","last_name":"Budi","active":"Y"},{"stylist_id":6,"first_name":"Ngok","last_name":"Tet","active":"Y"}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        products: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                products: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const selectAllActiveProduct = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllActiveProductQuery(sort, order), [],
                (_, success) => {
                    // success = {"rows":{"length":2},"rowsAffected":0}
                    // _array = [{"stylist_id":4,"first_name":"Anang","last_name":"Budi","active":"Y"},{"stylist_id":6,"first_name":"Ngok","last_name":"Tet","active":"Y"}]
                    let _array = []
                    for (let i = 0; i < success.rows.length; i++) {
                        _array.push(success.rows.item(i))
                    }
                    _callback({
                        products: {
                            _array,
                            length: success.rows.length
                        }
                    })
                }
            )
        },
        (error) => {
            _callback({
                products: {
                    _array: null,
                    length: 0
                }
            })
        },
        (success) => { }
    )
}

export const productsGot = (products, productsLen) => ({
    type: UPDATE_PRODUCT,
    payload: {
        products,
        productsLen
    }
})
