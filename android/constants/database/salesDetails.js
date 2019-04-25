import { PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
import { SALES_PRODUCTS_SCHEMA } from './salesProducts'
import { STYLISTS_SCHEMA } from './stylists'

export const SALES_DETAILS_SCHEMA = 'sales_details'

export const createSaleDetailTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + SALES_DETAILS_SCHEMA + ' (' +
        'sales_product_id INTEGER REFERENCES ' + SALES_PRODUCTS_SCHEMA + ' (sales_product_id) NOT NULL, ' +
        'stylist_id INTEGER REFERENCES ' + STYLISTS_SCHEMA + ' (stylist_id) NOT NULL, ' +
        'product_id INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (product_id) NOT NULL' +
        ')'
}
