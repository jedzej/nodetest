import React from 'react';
import Flag from 'material-ui-icons/Flag';
import Whatshot from 'material-ui-icons/Whatshot';
import GpsFixed from 'material-ui-icons/GpsFixed';
import GpsNotFixed from 'material-ui-icons/GpsNotFixed';

import MANIFEST from '../../manifest'


const { QUEST_STAGE } = MANIFEST.CONSTS;

const QuestIcon = props => ({
  [QUEST_STAGE.NOT_TAKEN]: <GpsNotFixed {...props} />,
  [QUEST_STAGE.ONGOING]: <GpsFixed {...props} />,
  [QUEST_STAGE.SUCCESS]: <Flag {...props} />,
  [QUEST_STAGE.FAILURE]: <Whatshot {...props} />
})[props.stage];


export default QuestIcon;
