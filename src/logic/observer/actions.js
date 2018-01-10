import { OBSERVER_JOIN, OBSERVER_SESSION_INTENT } from './types'

export const join = (token) => ({
  type: OBSERVER_JOIN,
  payload: { token }
});

export const sessionIntent = (token) => ({
  type: OBSERVER_SESSION_INTENT,
  payload: { token }
})
