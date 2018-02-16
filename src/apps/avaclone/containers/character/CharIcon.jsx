import React from 'react';
import Person from 'material-ui-icons/Person';
import PersonOutline from 'material-ui-icons/PersonOutline';

import MANIFEST from '../../manifest'


const { CHAR } = MANIFEST.CONSTS;

const CharIcon = props => {
  return ({
    [CHAR.ASSASSIN]: <Person {...props} />,
    [CHAR.MORGANA]: <Person {...props} />,
    [CHAR.MERLIN]: <PersonOutline {...props} />,
    [CHAR.MORDRED]: <Person {...props} />,
    [CHAR.PERCIVAL]: <PersonOutline {...props} />,
    [CHAR.OBERON]: <Person {...props} />,
    [CHAR.GOOD]: <PersonOutline {...props} />,
    [CHAR.EVIL]: <Person {...props} />,
  })[props.char];
}


export default CharIcon;
