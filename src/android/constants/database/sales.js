export const SALES_SCHEMA = 'sales'

export const SALE_ID = 'sale_id'
export const SALE_CUSTOMER_NAME = 'customer_name'
export const SALE_TIME_CREATED = 'time_created'
export const SALE_TIME_PAID = 'time_paid'
export const SALE_AMOUNT = 'sale_amount'
export const SALE_TAX_AMOUNT = 'tax_amount'
export const SALE_DISCOUNT_AMOUNT = 'discount_amount'
export const SALE_AMOUNT_PAID = 'sale_amount_paid'
export const SALE_ACTIVE = 'active'

export const CURRENT_TIMESTAMP = 'datetime(CURRENT_TIMESTAMP, \'localtime\')'

export const createSaleTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + SALES_SCHEMA + ' (' +
        SALE_ID + ' INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        SALE_CUSTOMER_NAME + ' VARCHAR (50) NOT NULL DEFAULT (\'\'), ' +
        SALE_TIME_CREATED + ' DATETIME NOT NULL DEFAULT (' + CURRENT_TIMESTAMP + '), ' +
        SALE_TIME_PAID + ' DATETIME DEFAULT NULL, ' +
        SALE_AMOUNT + ' INTEGER NOT NULL DEFAULT (0), ' +
        SALE_TAX_AMOUNT + ' INTEGER NOT NULL DEFAULT (0), ' +
        SALE_DISCOUNT_AMOUNT + ' INTEGER NOT NULL DEFAULT (0), ' +
        SALE_AMOUNT_PAID + ' INTEGER NOT NULL DEFAULT (0), ' +
        SALE_ACTIVE + ' CHAR (1) NOT NULL DEFAULT (\'Y\')' +
        ')'
}

export const insertSaleQuery = (sale) => {
    return 'INSERT INTO ' + SALES_SCHEMA + ' (' +
        SALE_CUSTOMER_NAME + ', ' +
        SALE_AMOUNT +
        ') VALUES (' +
        '\'' + sale[SALE_CUSTOMER_NAME] + '\', ' +
        sale[SALE_AMOUNT] +
        ')'
}

export const updateSaleQuery = (sale) => {
    return 'UPDATE ' + SALES_SCHEMA +
        ' SET ' +
        SALE_CUSTOMER_NAME + ' = \'' + sale[SALE_CUSTOMER_NAME] + '\', ' +
        SALE_TIME_CREATED + ' = \'' + sale[SALE_TIME_CREATED] + '\', ' +
        SALE_TIME_PAID + ' = ' + sale[SALE_TIME_PAID] + ', ' +
        SALE_AMOUNT + ' = ' + sale[SALE_AMOUNT] + ', ' +
        SALE_TAX_AMOUNT + ' = ' + sale[SALE_TAX_AMOUNT] + ', ' +
        SALE_DISCOUNT_AMOUNT + ' = ' + sale[SALE_DISCOUNT_AMOUNT] + ', ' +
        SALE_AMOUNT_PAID + ' = ' + sale[SALE_AMOUNT_PAID] + ', ' +
        SALE_ACTIVE + ' = \'' + sale[SALE_ACTIVE] + '\' ' +
        ' WHERE ' +
        SALE_ID + ' = ' + sale[SALE_ID]
}

export const deleteSaleQuery = (sale) => {
    return 'UPDATE ' + SALES_SCHEMA +
        ' SET ' +
        SALE_ACTIVE + ' = \'N\'' +
        ' WHERE ' +
        SALE_ID + ' = ' + sale[SALE_ID]
}

export const selectAllActiveSalePaidQuery = (startDate, endDate, sort, order) => {
    let query = 'SELECT * FROM ' + SALES_SCHEMA +
        ' WHERE ' +
        SALE_ACTIVE + ' = \'Y\' AND ' +
        SALE_TIME_PAID + ' >= datetime(\'' + startDate + ' 00:00:00\') AND ' +
        SALE_TIME_PAID + ' <= datetime(\'' + endDate + ' 24:00:00\')'
    if (sort) {
        query += ' ORDER BY ' + sort
        if (order === 'desc') query += ' DESC'
        else query += ' ASC'
    }
    return query
}

export const selectAllActiveSaleUnPaidQuery = (sort, order) => {
    let query = 'SELECT * FROM ' + SALES_SCHEMA +
        ' WHERE ' +
        SALE_ACTIVE + ' = \'Y\' AND ' +
        SALE_TIME_PAID + ' IS NULL'
    if (sort) {
        query += ' ORDER BY ' + sort
        if (order === 'desc') query += ' DESC'
        else query += ' ASC'
    }
    return query
}
