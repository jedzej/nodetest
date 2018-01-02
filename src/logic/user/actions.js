import { USER_REGISTER, USER_LOGIN, USER_LOGOUT } from './types'

export const register = (name, password) => ({
  type: USER_REGISTER,
  payload: { name, password }
});

export const login = (name, password) => ({
  type: USER_LOGIN,
  payload: { name, password }
});

export const logout = (name, password) => ({
  type: USER_LOGOUT
});
