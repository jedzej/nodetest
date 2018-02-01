import MANIFEST from './manifest'
const { ACTION } = MANIFEST.CONSTS;

export const configure = configuration => ({
  type: ACTION.AVACLONE_CONFIGURE,
  payload: { configuration }
});

export const start = () => ({
  type: ACTION.AVACLONE_START
});

export const questSelect = (questNumber) => ({
  type: ACTION.AVACLONE_QUEST_SELECT,
  payload: { questNumber }
});

export const squadPropose = (squad) => ({
  type: ACTION.AVACLONE_SQUAD_PROPOSE,
  payload: { squad }
});

export const squadConfirm = () => ({
  type: ACTION.AVACLONE_SQUAD_CONFIRM
});

export const squadVote = (vote) => ({
  type: ACTION.AVACLONE_SQUAD_VOTE,
  payload: { vote }
});

export const questVote = (vote) => ({
  type: ACTION.AVACLONE_QUEST_VOTE,
  payload: { vote }
});


