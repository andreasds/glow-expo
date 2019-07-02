import { DISABLE_BLUETOOTH, ENABLE_BLUETOOTH, UPDATE_BLUETOOTH, UPDATE_PRINTER } from '../actions/types'

const initialState = {
    isEnable: false,
    printer: null,
    found: null,
    paired: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case DISABLE_BLUETOOTH: {
            return {
                ...state,
                isEnable: false,
                printer: null,
                found: null,
                paired: null
            }
        }
        case ENABLE_BLUETOOTH: {
            return {
                ...state,
                isEnable: true
            }
        }
        case UPDATE_BLUETOOTH: {
            const { found, paired } = action.payload
            return {
                ...state,
                found,
                paired
            }
        }
        case UPDATE_PRINTER: {
            const { printer } = action.payload
            return {
                ...state,
                printer
            }
        }
        default:
            return state
    }
}
