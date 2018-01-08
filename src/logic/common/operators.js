import { map } from 'rxjs/operators';
import { success, error, warning, info } from 'react-notification-system-redux';

const titleNotification = title => ({
  title: title,
  position: 'tr',
  autoDismiss: 2
})

export const simpleNotificationErrorAction = (title, action) => error({
  title: title,
  message: action.payload ? action.payload.message : undefined,
  position: 'tr',
})
export const simpleNotificationSuccessAction = (title, action) => success(titleNotification(title))
export const simpleNotificationInfoAction = (title, action) => info(titleNotification(title))
export const simpleNotificationWarningAction = (title, action) => warning(titleNotification(title))

export const simpleNotificationError = title =>
  map(action => simpleNotificationErrorAction(title, action))
export const simpleNotificationSuccess = title =>
  map(action => simpleNotificationSuccessAction(title, action))
  export const simpleNotificationInfo = title =>
  map(action => simpleNotificationInfoAction(title, action))
  export const simpleNotificationWarning = title =>
  map(action => simpleNotificationWarningAction(title, action))