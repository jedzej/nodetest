import { APP_UPDATE_REQUEST, APP_TERMINATE, APP_START } from './types'

export const start = (name) => ({
  type: APP_START,
  payload: {name  }
})

export const terminate = (name) => ({
  type: APP_TERMINATE,
  payload: { name }
})

export const update = () => ({
  type: APP_UPDATE_REQUEST
});
