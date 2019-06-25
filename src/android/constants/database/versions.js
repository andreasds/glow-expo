export const VERSIONS_SCHEMA = 'versions'

export const insertCurrentVersionQuery = (current_version) => {
    return 'INSERT INTO ' + VERSIONS_SCHEMA + ' (' +
        'version' +
        ') VALUES (' +
        '\'' + current_version + '\'' +
        ')'
}

export const getLastVersionQuery = () => {
    return 'SELECT * FROM ' + VERSIONS_SCHEMA + ' ' +
        'ORDER BY time_updated DESC ' +
        'LIMIT 1'
}

export const createVersionTableQuery = () => {
    return 'CREATE TABLE IF NOT EXISTS ' + VERSIONS_SCHEMA + ' (' +
        'version VARCHAR (20) UNIQUE NOT NULL, ' +
        'time_updated DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)' +
        ')'
}
