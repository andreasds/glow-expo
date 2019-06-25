import { DISABLE_BLUETOOTH, ENABLE_BLUETOOTH } from '../actions/types'

const initialState = {
    isEnable: false
}

export default (state = initialState, action) => {
    switch (action.type) {
        case DISABLE_BLUETOOTH: {
            return {
                ...state,
                isEnable: false
            }
        }
        case ENABLE_BLUETOOTH: {
            return {
                ...state,
                isEnable: true
            }
        }
        default:
            return state
    }
}
