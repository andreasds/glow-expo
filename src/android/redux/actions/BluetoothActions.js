import { CLOSE_DATABASE, OPEN_DATABASE } from './types'

export const databaseOpened = (db) => ({
    type: OPEN_DATABASE,
    payload: {
        db
    }
})

export const databaseClosed = () => ({
    type: CLOSE_DATABASE,
    payload: {
        db: null
    }
})
