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

export const getStylistQuery = (stylist) => {
    return 'SELECT * FROM ' + STYLISTS_SCHEMA +
        ' WHERE ' +
        STYLIST_FIRST_NAME + ' = \'' + stylist[STYLIST_FIRST_NAME] + '\'' + ' AND ' +
        STYLIST_LAST_NAME + ' = \'' + stylist[STYLIST_LAST_NAME] + '\'' + ' AND ' +
        STYLIST_ACTIVE + ' = \'Y\''
}

export const insertStylistQuery = (stylist) => {
    return 'INSERT INTO ' + STYLISTS_SCHEMA + ' (' +
        STYLIST_FIRST_NAME + ', ' +
        STYLIST_LAST_NAME +
        ') VALUES (' +
        '\'' + stylist[STYLIST_FIRST_NAME] + '\', ' +
        '\'' + stylist[STYLIST_LAST_NAME] + '\'' +
        ')'
}

export const updateStylistQuery = (stylist) => {
    return 'UPDATE ' + STYLISTS_SCHEMA +
        ' SET ' +
        STYLIST_FIRST_NAME + ' = \'' + stylist[STYLIST_FIRST_NAME] + '\', ' +
        STYLIST_LAST_NAME + ' = \'' + stylist[STYLIST_LAST_NAME] + '\', ' +
        STYLIST_ACTIVE + ' = \'' + stylist[STYLIST_ACTIVE] + '\'' +
        ' WHERE ' +
        STYLIST_ID + ' = ' + stylist[STYLIST_ID]
}

export const deleteStylistQuery = (stylist) => {
    return 'UPDATE ' + STYLISTS_SCHEMA +
        ' SET ' +
        STYLIST_ACTIVE + ' = \'N\'' +
        ' WHERE ' +
        STYLIST_ID + ' = ' + stylist[STYLIST_ID]
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
