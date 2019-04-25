export const STYLISTS_SCHEMA = 'stylists'

export const createStylistTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + STYLISTS_SCHEMA + ' (' +
        'stylist_id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        'first_name VARCHAR (50) NOT NULL, ' +
        'last_name VARCHAR (50) NOT NULL DEFAULT (\'\'), ' +
        'active CHAR (1) NOT NULL DEFAULT (\'Y\')' +
        ')'
}
