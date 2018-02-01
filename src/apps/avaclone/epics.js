import { combineEpics } from 'redux-observable';
import { webSocketWrite } from '../../webSocketMiddleware'
import MANIFEST from './manifest'

const ACTION = MANIFEST.CONSTS.ACTION;

const wsTransmitEpic = action$ => action$
  .ofType(
  ACTION.AVACLONE_CONFIGURE,
  ACTION.AVACLONE_START,
  ACTION.AVACLONE_QUEST_SELECT,
  ACTION.AVACLONE_SQUAD_PROPOSE,
  ACTION.AVACLONE_SQUAD_CONFIRM,
  ACTION.AVACLONE_QUEST_VOTE,
  )
  .let(webSocketWrite)


export default combineEpics(
  wsTransmitEpic
);
