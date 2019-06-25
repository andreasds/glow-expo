import { PRODUCT_ID, PRODUCT_NAME, PRODUCTS_DETAILS_SCHEMA } from './productsDetails'
import { SALE_ACTIVE, SALE_ID, SALE_TIME_PAID, SALES_SCHEMA } from './sales'
import { SALE_PRODUCT_ID, SALES_PRODUCTS_SCHEMA } from './salesProducts'
import { STYLIST_ID, STYLIST_FIRST_NAME, STYLIST_LAST_NAME, STYLISTS_SCHEMA } from './stylists'

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

export const selectAllSaleDetailBySaleQuery = (sale_id) => {
    return 'SELECT ' +
        'a.' + SALE_PRODUCT_ID + ' AS ' + SALE_PRODUCT_ID + ', ' +
        'a.' + STYLIST_ID + ' AS ' + STYLIST_ID + ', ' +
        'a.' + PRODUCT_ID + ' AS ' + PRODUCT_ID +
        ' FROM ' + SALES_DETAILS_SCHEMA + ' a' +
        ' LEFT JOIN ' + SALES_PRODUCTS_SCHEMA + ' b ON a.' + SALE_PRODUCT_ID + ' = b.' + SALE_PRODUCT_ID +
        ' WHERE b.' + SALE_ID + ' = ' + sale_id
}

export const summaryStylistsQuery = (startDate, endDate) => {
    return 'SELECT' +
        ' count(e.' + PRODUCT_ID + ') AS count,' +
        ' e.' + PRODUCT_ID + ' AS package_id,' +
        ' e.' + PRODUCT_NAME + ' AS package_name,' +
        ' b.' + PRODUCT_ID + ' AS ' + PRODUCT_ID + ',' +
        ' b.' + PRODUCT_NAME + ' AS product_name,' +
        ' c.' + STYLIST_ID + ' AS ' + STYLIST_ID + ',' +
        ' c.' + STYLIST_FIRST_NAME + ' AS ' + STYLIST_FIRST_NAME + ',' +
        ' c.' + STYLIST_LAST_NAME + ' AS ' + STYLIST_LAST_NAME +
        ' FROM ' + SALES_DETAILS_SCHEMA + ' a' +
        ' LEFT JOIN ' + PRODUCTS_DETAILS_SCHEMA + ' b ON a.' + PRODUCT_ID + ' = b.' + PRODUCT_ID +
        ' LEFT JOIN ' + STYLISTS_SCHEMA + ' c ON a.' + STYLIST_ID + ' = c.' + STYLIST_ID +
        ' LEFT JOIN ' + SALES_PRODUCTS_SCHEMA + ' d ON a.' + SALE_PRODUCT_ID + ' = d.' + SALE_PRODUCT_ID +
        ' LEFT JOIN ' + PRODUCTS_DETAILS_SCHEMA + ' e ON d.' + PRODUCT_ID + ' = e.' + PRODUCT_ID +
        ' LEFT JOIN ' + SALES_SCHEMA + ' f ON d.' + SALE_ID + ' = f.' + SALE_ID +
        ' WHERE' +
        ' f.' + SALE_TIME_PAID + ' >= datetime(\'' + startDate + ' 00:00:00\') AND' +
        ' f.' + SALE_TIME_PAID + ' <= datetime(\'' + endDate + ' 24:00:00\') AND' +
        ' f.' + SALE_ACTIVE + ' = \'Y\'' +
        ' GROUP BY' +
        ' c.' + STYLIST_ID + ',' +
        ' b.' + PRODUCT_ID + ',' +
        ' e.' + PRODUCT_ID +
        ' ORDER BY' +
        ' c.' + STYLIST_FIRST_NAME + ' ASC,' +
        ' b.' + PRODUCT_NAME + ' ASC,' +
        ' e.' + PRODUCT_NAME + ' ASC'
}
