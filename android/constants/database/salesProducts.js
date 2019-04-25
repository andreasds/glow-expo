import { PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
import { SALES_SCHEMA } from './sales'

export const SALES_PRODUCTS_SCHEMA = 'sales_products'

export const createSaleProductTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + SALES_PRODUCTS_SCHEMA + ' (' +
        'sales_product_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        'sales_id INTEGER REFERENCES ' + SALES_SCHEMA + ' (sales_id) NOT NULL, ' +
        'product_id INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (product_id) NOT NULL, ' +
        'price INTEGER NOT NULL DEFAULT (0)' +
        ')'
}
