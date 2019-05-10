import { PRODUCTS_DETAILS_SCHEMA, PRODUCT_ID } from './productsDetails'

export const PRODUCTS_SCHEMA = 'products'

export const PARENT_PRODUCT_ID = 'parent_product_id'
export const CHILD_PRODUCT_ID = 'child_product_id'

export const createProductTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + PRODUCTS_SCHEMA + ' (' +
        PARENT_PRODUCT_ID + ' INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (' + PRODUCT_ID + ') NOT NULL, ' +
        CHILD_PRODUCT_ID + ' INTEGER REFERENCES ' + PRODUCTS_DETAILS_SCHEMA + ' (' + PRODUCT_ID + ') NOT NULL' +
        ')'
}

export const insertPackageQuery = (productPackage) => {
    return 'INSERT INTO ' + PRODUCTS_SCHEMA + ' (' +
        PARENT_PRODUCT_ID + ', ' +
        CHILD_PRODUCT_ID +
        ') VALUES (' +
        productPackage[PARENT_PRODUCT_ID] + ', ' +
        productPackage[CHILD_PRODUCT_ID] +
        ')'
}

export const deletePackageQuery = (parent_product_id) => {
    return 'DELETE FROM ' + PRODUCTS_SCHEMA +
        ' WHERE ' + PARENT_PRODUCT_ID + ' = ' + parent_product_id
}

export const selectAllPackageByParentQuery = (parent_product_id) => {
    return 'SELECT * FROM ' + PRODUCTS_SCHEMA +
        ' WHERE ' + PARENT_PRODUCT_ID + ' = ' + parent_product_id
}
