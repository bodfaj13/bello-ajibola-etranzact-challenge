import * as CONSTANTS from '../constants'

const initialState = {
  loading: false,
  success: null,
  token: null
}

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANTS.LOGIN_USER:
      return {
        ...state,
        success: action.success,
        token: action.token,
      }
    case CONSTANTS.LOGOUT_USER:
      return {
        ...state,
        success: action.token,
        token: action.token,
      }
    default:
      return state
  }
}

export default userReducer