import { PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
import { STYLISTS_SCHEMA } from './stylists'

export const STYLISTS_SERVICES_SCHEMA = 'stylists_services'

export const createStylistServiceTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + STYLISTS_SERVICES_SCHEMA + ' (' +
        'stylist_id INTEGER REFERENCES ' + STYLISTS_SCHEMA + ' (stylist_id) NOT NULL, ' +
        'product_id INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (product_id) NOT NULL, ' +
        'price INTEGER NOT NULL DEFAULT (0)' +
        ')'
}
