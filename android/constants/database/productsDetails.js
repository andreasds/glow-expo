export const PRODUCTS_DETAILS_SCHEMA = 'products_details'

export const PRODUCT_ID = 'product_id'
export const PRODUCT_NAME = 'name'
export const PRODUCT_PRICE = 'price'
export const PRODUCT_PACKAGE = 'package'
export const PRODUCT_PACKAGE_PRICE = 'package_price'
export const PRODUCT_ACTIVE = 'active'

export const createProductDetailTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + PRODUCTS_DETAILS_SCHEMA + ' (' +
        PRODUCT_ID + ' INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        PRODUCT_NAME + ' VARCHAR (50) NOT NULL, ' +
        PRODUCT_PRICE + ' INTEGER NOT NULL, ' +
        PRODUCT_PACKAGE + ' CHAR (1) NOT NULL DEFAULT (\'N\'), ' +
        PRODUCT_PACKAGE_PRICE + ' CHAR (1) NOT NULL DEFAULT (\'Y\'), ' +
        PRODUCT_ACTIVE + ' CHAR (1) NOT NULL DEFAULT (\'Y\')' +
        ')'
}

export const insertProductQuery = (product) => {
    return 'INSERT INTO ' + PRODUCTS_DETAILS_SCHEMA + ' (' +
        PRODUCT_NAME + ', ' +
        PRODUCT_PRICE + ', ' +
        PRODUCT_PACKAGE +
        ') VALUES (' +
        '\'' + product[PRODUCT_NAME] + '\', ' +
        product[PRODUCT_PRICE] + ', ' +
        '\'' + product[PRODUCT_PACKAGE] + '\'' +
        ')'
}

export const updateProductQuery = (product) => {
    return 'UPDATE ' + PRODUCTS_DETAILS_SCHEMA +
        ' SET ' +
        PRODUCT_NAME + ' = \'' + product[PRODUCT_NAME] + '\', ' +
        PRODUCT_PRICE + ' = ' + product[PRODUCT_PRICE] + ', ' +
        PRODUCT_PACKAGE + ' = \'' + product[PRODUCT_PACKAGE] + '\', ' +
        PRODUCT_PACKAGE_PRICE + ' = \'' + product[PRODUCT_PACKAGE_PRICE] + '\', ' +
        PRODUCT_ACTIVE + ' = \'' + product[PRODUCT_ACTIVE] + '\' ' +
        ' WHERE ' +
        PRODUCT_ID + ' = ' + product[PRODUCT_ID]
}

export const deleteProductQuery = (product) => {
    return 'UPDATE ' + PRODUCTS_DETAILS_SCHEMA +
        ' SET ' +
        PRODUCT_ACTIVE + ' = \'N\'' +
        ' WHERE ' +
        PRODUCT_ID + ' = ' + product[PRODUCT_ID]
}

export const selectAllProductQuery = (sort, order) => {
    let query = 'SELECT * FROM ' + PRODUCTS_DETAILS_SCHEMA
    if (sort) {
        query += ' ORDER BY ' + sort
        if (order === 'desc') query += ' DESC'
        else query += ' ASC'
    }
    return query
}

export const selectAllActiveProductQuery = (sort, order) => {
    let query = 'SELECT * FROM ' + PRODUCTS_DETAILS_SCHEMA +
        ' WHERE ' +
        PRODUCT_ACTIVE + ' = \'Y\''
    if (sort) {
        query += ' ORDER BY ' + sort
        if (order === 'desc') query += ' DESC'
        else query += ' ASC'
    }
    return query
}
