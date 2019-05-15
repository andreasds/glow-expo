import { UPDATE_SALE } from '../actions/types'

const initialState = {
    sales: null,
    salesLen: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_SALE: {
            const { sales, salesLen } = action.payload
            return {
                ...state,
                sales,
                salesLen
            }
        }
        default:
            return state
    }
}
