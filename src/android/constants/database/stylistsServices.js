import { PRODUCTS_DETAILS_SCHEMA, PRODUCT_ACTIVE, PRODUCT_ID } from './productsDetails'
import { STYLISTS_SCHEMA, STYLIST_ACTIVE, STYLIST_ID } from './stylists'

export const STYLISTS_SERVICES_SCHEMA = 'stylists_services'

export const STYLISTS_SERVICES_PRICE = 'price'

export const createStylistServiceTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + STYLISTS_SERVICES_SCHEMA + ' (' +
        STYLIST_ID + ' INTEGER REFERENCES ' + STYLISTS_SCHEMA + ' (' + STYLIST_ID + ') NOT NULL, ' +
        PRODUCT_ID + ' INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (' + PRODUCT_ID + ') NOT NULL, ' +
        STYLISTS_SERVICES_PRICE + ' INTEGER NOT NULL DEFAULT (0)' +
        ')'
}

export const insertStylistServiceQuery = (stylistService) => {
    return 'INSERT INTO ' + STYLISTS_SERVICES_SCHEMA + ' (' +
        STYLIST_ID + ', ' +
        PRODUCT_ID + ', ' +
        STYLISTS_SERVICES_PRICE +
        ') VALUES (' +
        stylistService[STYLIST_ID] + ', ' +
        stylistService[PRODUCT_ID] + ', ' +
        stylistService[STYLISTS_SERVICES_PRICE] +
        ')'
}

export const updateStylistServiceQuery = (stylistService) => {
    return 'UPDATE ' + STYLISTS_SERVICES_SCHEMA +
        ' SET ' +
        STYLISTS_SERVICES_PRICE + ' = ' + stylistService[STYLISTS_SERVICES_PRICE] +
        ' WHERE ' +
        STYLIST_ID + ' = ' + stylistService[STYLIST_ID] + ' AND ' +
        PRODUCT_ID + ' = ' + stylistService[PRODUCT_ID]
}

export const selectAllStylistServiceQuery = () => {
    return 'SELECT ' +
        'a.' + STYLIST_ID + ' AS ' + STYLIST_ID + ', ' +
        'a.' + PRODUCT_ID + ' AS ' + PRODUCT_ID + ', ' +
        'a.' + STYLISTS_SERVICES_PRICE + ' AS ' + STYLISTS_SERVICES_PRICE +
        ' FROM ' + STYLISTS_SERVICES_SCHEMA + ' a' +
        ' LEFT JOIN ' + STYLISTS_SCHEMA + ' b ON a.' + STYLIST_ID + ' = b.' + STYLIST_ID +
        ' LEFT JOIN ' + PRODUCTS_DETAILS_SCHEMA + ' c ON a.' + PRODUCT_ID + ' = c.' + PRODUCT_ID +
        ' WHERE b.' + STYLIST_ACTIVE + ' = \'Y\'' + ' AND ' +
        'c.' + PRODUCT_ACTIVE + ' = \'Y\''
}

export const selectAllStylistServiceByProductQuery = (product_id) => {
    return 'SELECT * FROM ' + STYLISTS_SERVICES_SCHEMA +
        ' WHERE ' + PRODUCT_ID + ' = ' + product_id
}

export const selectAllStylistServiceByStylistQuery = (stylist_id) => {
    return 'SELECT * FROM ' + STYLISTS_SERVICES_SCHEMA +
        ' WHERE ' + STYLIST_ID + ' = ' + stylist_id
}
