import { PRODUCT_ID, PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
import { SALE_ID } from './sales'
import { SALE_PRODUCT_ID, SALES_PRODUCTS_SCHEMA } from './salesProducts'
import { STYLIST_ID, STYLISTS_SCHEMA } from './stylists'

export const SALES_DETAILS_SCHEMA = 'sales_details'

export const createSaleDetailTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + SALES_DETAILS_SCHEMA + ' (' +
        SALE_PRODUCT_ID + ' INTEGER REFERENCES ' + SALES_PRODUCTS_SCHEMA + ' (' + SALE_PRODUCT_ID + ') NOT NULL, ' +
        STYLIST_ID + '  INTEGER REFERENCES ' + STYLISTS_SCHEMA + ' (' + STYLIST_ID + ') NOT NULL, ' +
        PRODUCT_ID + ' INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (' + PRODUCT_ID + ') NOT NULL' +
        ')'
}

export const insertSaleDetailQuery = (saleDetail) => {
    return 'INSERT INTO ' + SALES_DETAILS_SCHEMA + ' (' +
        SALE_PRODUCT_ID + ', ' +
        STYLIST_ID + ', ' +
        PRODUCT_ID +
        ') VALUES (' +
        saleDetail[SALE_PRODUCT_ID] + ', ' +
        saleDetail[STYLIST_ID] + ', ' +
        saleDetail[PRODUCT_ID] +
        ')'
}

export const deleteSaleDetailQuery = (sale_id) => {
    return 'DELETE FROM ' + SALES_DETAILS_SCHEMA +
        ' WHERE ' + SALE_PRODUCT_ID + ' IN (' +
        ' SELECT ' + SALE_PRODUCT_ID + ' FROM ' + SALES_PRODUCTS_SCHEMA +
        ' WHERE ' + SALE_ID + ' = ' + sale_id +
        ' )'
}
