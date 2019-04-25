export const SALES_SCHEMA = 'sales'

export const createSaleTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + SALES_SCHEMA + ' (' +
        'sales_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        'customer_name VARCHAR (50) NOT NULL DEFAULT (\'\'), ' +
        'time_created DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP), ' +
        'time_paid DATETIME DEFAULT NULL, ' +
        'sale_amount INTEGER NOT NULL DEFAULT (0), ' +
        'tax_amount INTEGER NOT NULL DEFAULT (0), ' +
        'discount_amount INTEGER NOT NULL DEFAULT (0), ' +
        'sale_amount_paid INTEGER NOT NULL DEFAULT (0), ' +
        'active CHAR (1) NOT NULL DEFAULT (\'Y\')' +
        ')'
}
