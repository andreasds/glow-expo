import { UPDATE_STYLIST } from '../actions/types'

const initialState = {
    stylists: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STYLIST: {
            const { stylists } = action.payload
            return {
                ...state,
                stylists
            }
        }
        default:
            return state
    }
}
