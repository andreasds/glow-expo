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
                    // success = {"insertId":0,"rowsAffected":0,"rows":{"_array":[],"length":0}}
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

export const insertProduct = (db, product, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(insertProductQuery(product), [],
                (_, success) => {
                    // success = {"insertId":11,"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({
                        insertProduct: {
                            result: 'success',
                            insertId: success.insertId
                        }
                    })
                },
                (error) => {
                    _callback({ insertProduct: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const updateProduct = (db, product, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(updateProductQuery(product), [],
                (_, success) => {
                    // success = {"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({ updateProduct: { result: 'success' } })
                },
                (error) => {
                    _callback({ updateProduct: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const deleteProduct = (db, product, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(deleteProductQuery(product), [],
                (_, success) => {
                    // success = {"rowsAffected":1,"rows":{"_array":[],"length":0}}
                    _callback({ deleteProduct: { result: 'success' } })
                },
                (error) => {
                    _callback({ deleteProduct: { result: 'error', error } })
                }
            )
        },
        (error) => { },
        (success) => { }
    )
}

export const selectAllProduct = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            console.log('sort = ' + JSON.stringify(sort) + ', order = ' + JSON.stringify(order))
            console.log('query = ' + JSON.stringify(selectAllProductQuery(sort, order)))
            tx.executeSql(selectAllProductQuery(sort, order), [],
                (_, success) => {
                    // _array = [{"product_id":1,"first_name":"Wewew","last_name":"Hahay","active":"Y"},{"product_id":2,"first_name":"Nguing","last_name":"Ndut","active":"Y"}]
                    console.log('success = ' + JSON.stringify(success))
                    _callback({
                        products: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        products: {
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

export const selectAllActiveProduct = (db, sort, order, _callback) => {
    db.transaction(
        (tx) => {
            tx.executeSql(selectAllActiveProductQuery(sort, order), [],
                (_, success) => {
                    // success = {"rowsAffected":0,"rows":{"_array":[{"product_id":1,"name":"Cuci Blow","price":40000,"package":"N","package_price":"Y","active":"Y"},{"product_id":4,"name":"Gunting Cewe","price":60000,"package":"N","package_price":"Y","active":"Y"}],"length":2}}
                    _callback({
                        products: {
                            _array: success.rows._array,
                            length: success.rows.length
                        }
                    })
                },
                (error) => {
                    _callback({
                        products: {
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

export const productsGot = (products, productsLen) => ({
    type: UPDATE_PRODUCT,
    payload: {
        products,
        productsLen
    }
})
