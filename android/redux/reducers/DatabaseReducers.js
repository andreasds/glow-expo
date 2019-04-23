import { OPEN_DATABASE, CLOSE_DATABASE } from '../actions/types'

const initialState = {
    db: {}
}

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_DATABASE: {
            const { db } = action.payload
            return {
                ...state,
                db
            }
        }
        case CLOSE_DATABASE: {
            return {
                ...state,
                db: {}
            }
        }
        default:
            return state
    }
}
