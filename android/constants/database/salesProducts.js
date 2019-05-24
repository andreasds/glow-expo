import { PRODUCT_ID, PRODUCT_PACKAGE, PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
import { SALE_ID, SALES_SCHEMA } from './sales'

export const SALES_PRODUCTS_SCHEMA = 'sales_products'

export const SALE_PRODUCT_ID = 'sale_product_id'
export const SALE_PRODUCT_PRICE = 'price'

export const createSaleProductTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + SALES_PRODUCTS_SCHEMA + ' (' +
        SALE_PRODUCT_ID + ' INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        SALE_ID + ' INTEGER REFERENCES ' + SALES_SCHEMA + ' (' + SALE_ID + ') NOT NULL, ' +
        PRODUCT_ID + ' INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (' + PRODUCT_ID + ') NOT NULL, ' +
        SALE_PRODUCT_PRICE + ' INTEGER NOT NULL DEFAULT (0)' +
        ')'
}

export const insertSaleProductQuery = (saleProduct) => {
    return 'INSERT INTO ' + SALES_PRODUCTS_SCHEMA + ' (' +
        SALE_ID + ', ' +
        PRODUCT_ID + ', ' +
        SALE_PRODUCT_PRICE +
        ') VALUES (' +
        saleProduct[SALE_ID] + ', ' +
        saleProduct[PRODUCT_ID] + ', ' +
        saleProduct[SALE_PRODUCT_PRICE] +
        ')'
}

export const deleteSaleProductQuery = (sale_id) => {
    return 'DELETE FROM ' + SALES_PRODUCTS_SCHEMA +
        ' WHERE ' + SALE_ID + ' = ' + sale_id
}

export const selectAllSaleProductBySaleQuery = (sale_id) => {
    return 'SELECT ' +
        'a.' + SALE_PRODUCT_ID + ' AS ' + SALE_PRODUCT_ID + ', ' +
        'a.' + SALE_ID + ' AS ' + SALE_ID + ', ' +
        'a.' + PRODUCT_ID + ' AS ' + PRODUCT_ID + ', ' +
        'a.' + SALE_PRODUCT_PRICE + ' AS ' + SALE_PRODUCT_PRICE + ', ' +
        'b.' + PRODUCT_PACKAGE + ' AS ' + PRODUCT_PACKAGE +
        ' FROM ' + SALES_PRODUCTS_SCHEMA + ' a' +
        ' LEFT JOIN ' + PRODUCTS_DETAILS_SCHEMA + ' b on a.' + PRODUCT_ID + ' = b.' + PRODUCT_ID +
        ' WHERE a.' + SALE_ID + ' = ' + sale_id
}
