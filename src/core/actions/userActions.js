import * as CONSTANTS from '../constants'

export const loginUser = ({ success, token }) => {
  localStorage.setItem('token', token)
  return ({
    type: CONSTANTS.LOGIN_USER,
    success,
    token
  })
}

export const logoutUser = () => {
  localStorage.removeItem('token')
  return ({
    type: CONSTANTS.LOGOUT_USER,
    success: null,
    token: null
  })
}
