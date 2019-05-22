import { PRODUCT_ID, PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
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
