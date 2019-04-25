export const PRODUCTS_DETAILS_SCHEMA = 'products_details'

export const createProductDetailTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + PRODUCTS_DETAILS_SCHEMA + ' (' +
        'product_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        'name VARCHAR (50) NOT NULL, ' +
        'price INTEGER NOT NULL, ' +
        'package CHAR (1) NOT NULL DEFAULT (\'N\'), ' +
        'package_price CHAR (1) NOT NULL DEFAULT (\'Y\'), ' +
        'active CHAR (1) NOT NULL DEFAULT (\'Y\')' +
        ')'
}
