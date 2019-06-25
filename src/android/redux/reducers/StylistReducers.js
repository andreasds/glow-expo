import { UPDATE_STYLIST } from '../actions/types'

const initialState = {
    stylists: null,
    stylistsLen: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_STYLIST: {
            const { stylists, stylistsLen } = action.payload
            return {
                ...state,
                stylists,
                stylistsLen
            }
        }
        default:
            return state
    }
}
