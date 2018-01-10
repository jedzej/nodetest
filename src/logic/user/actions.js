import { USER_REGISTER, USER_LOGIN, USER_LOGOUT, USER_UPDATE_REQUEST, USER_SESSION_INTENT } from './types'

export const sessionIntent = () => ({
  type: USER_SESSION_INTENT
})

export const register = (name, password) => ({
  type: USER_REGISTER,
  payload: { name, password }
});

export const login = (name, password) => ({
  type: USER_LOGIN,
  payload: { name, password }
});

export const loginByToken = (token) => ({
  type: USER_LOGIN,
  payload: { token }
});

export const logout = (name, password) => ({
  type: USER_LOGOUT
});

export const update = () => ({
  type: USER_UPDATE_REQUEST
});