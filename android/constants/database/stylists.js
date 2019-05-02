export const STYLISTS_SCHEMA = 'stylists'

export const STYLIST_ID = 'stylist_id'
export const STYLIST_FIRST_NAME = 'first_name'
export const STYLIST_LAST_NAME = 'last_name'
export const STYLIST_ACTIVE = 'active'

export const createStylistTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + STYLISTS_SCHEMA + ' (' +
        STYLIST_ID + ' INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE NOT NULL, ' +
        STYLIST_FIRST_NAME + ' VARCHAR (50) NOT NULL, ' +
        STYLIST_LAST_NAME + ' VARCHAR (50) NOT NULL DEFAULT (\'\'), ' +
        STYLIST_ACTIVE + ' CHAR (1) NOT NULL DEFAULT (\'Y\')' +
        ')'
}

export const insertStylistQuery = (stylist) => {
    return 'INSERT INTO ' + STYLISTS_SCHEMA + ' (' +
        STYLIST_FIRST_NAME + ', ' +
        STYLIST_LAST_NAME +
        ') VALUES (' +
        '\'' + stylist.first_name + '\', ' +
        '\'' + stylist.last_name + '\'' +
        ')'
}

export const updateStylistQuery = (stylist) => {
    return 'UPDATE ' + STYLISTS_SCHEMA +
        ' SET ' +
        STYLIST_FIRST_NAME + ' = \'' + stylist.first_name + '\', ' +
        STYLIST_LAST_NAME + ' = \'' + stylist.last_name + '\', ' +
        STYLIST_ACTIVE + ' = \'' + stylist.active + '\' ' +
        ' WHERE ' +
        STYLIST_ID + ' = ' + stylist.stylist_id
}

export const deleteStylistQuery = (stylist) => {
    return 'UPDATE ' + STYLISTS_SCHEMA +
        ' SET ' +
        STYLIST_ACTIVE + ' = \'N\'' +
        ' WHERE ' +
        STYLIST_ID + ' = ' + stylist.stylist_id
}

export const selectAllStylistQuery = (sort, order) => {
    let query = 'SELECT * FROM ' + STYLISTS_SCHEMA
    if (sort) {
        query += ' ORDER BY ' + sort
        if (order === 'desc') query += ' DESC'
        else query += ' ASC'
    }
    return query
}

export const selectAllActiveStylistQuery = (sort, order) => {
    let query = 'SELECT * FROM ' + STYLISTS_SCHEMA +
        ' WHERE ' +
        STYLIST_ACTIVE + ' = \'Y\''
    if (sort) {
        query += ' ORDER BY ' + sort
        if (order === 'desc') query += ' DESC'
        else query += ' ASC'
    }
    return query
}
