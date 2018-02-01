import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { terminate } from '../../../logic/app/actions';
import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { configure, start, questSelect } from '../actions';

import MANIFEST from '../manifest'
import Button from 'material-ui/Button/Button';
import Checkbox from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import FormGroup from 'material-ui/Form/FormGroup';
import SpecialCharactersSelector from './configuration/SpecialCharactersSelector'
import _ from 'lodash';
import Paper from 'material-ui/Paper/Paper';

const ac = require('../acutils');

const { CHAR, QUEST_STAGE } = MANIFEST.CONSTS;

const styles = theme => {
  console.log(theme); return ({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing.unit * 2,
      height: '100%',
    },
    control: {
      padding: theme.spacing.unit * 2,
    },
    headline: {
      paddingBottom: theme.spacing.unit * 2
    },
    settingsButton: {
      position: 'absolute',
      top: '10px',
      right: '10px'
    },
    undoButton: {
      position: 'absolute',
      bottom: '10px',
      right: '50px'
    },
    undoButtonDisabled: {
      position: 'absolute',
      color: '#CCC',
      bottom: '10px',
      right: '50px'
    },
    clearButton: {
      position: 'absolute',
      bottom: '10px',
      right: '90px'
    },
    paletteButton: {
      position: 'absolute',
      bottom: '10px',
      right: '10px'
    },
    canvasContainer: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#fff'
    }
  })
};


class QuestSelectionSection extends React.Component {

  render() {
    const { quests } = this.props.avaclone.store;
    return (
      <Paper>
        {Object.values(quests).map(quest => (
          <Button
            disabled={ac.is.quest.taken(quest)}
            onClick={() => this.props.questSelect(quest.number)}
          >{quest.number}</Button>
        ))}
      </Paper>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  questSelect: (number) => dispatch(questSelect(number)),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(QuestSelectionSection)
);
