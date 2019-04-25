import { PRODUCTS_DETAILS_SCHEMA } from './productsDetails'

export const PRODUCTS_SCHEMA = 'products'

export const createProductTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + PRODUCTS_SCHEMA + ' (' +
        'parent_product_id INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (product_id) NOT NULL, ' +
        'child_product_id INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (product_id) NOT NULL' +
        ')'
}
