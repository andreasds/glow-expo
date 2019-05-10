import { UPDATE_PRODUCT } from '../actions/types'

const initialState = {
    products: null,
    productsLen: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_PRODUCT: {
            const { products, productsLen } = action.payload
            return {
                ...state,
                products,
                productsLen
            }
        }
        default:
            return state
    }
}
