import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { terminate } from '../../../logic/app/actions';
import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { configure, start, questSelect, squadConfirm, squadPropose, questVote, squadVote } from '../actions';

import MANIFEST from '../manifest'
import Button from 'material-ui/Button/Button';
import Checkbox from 'material-ui/Checkbox';
import FormControlLabel from 'material-ui/Form/FormControlLabel';
import FormGroup from 'material-ui/Form/FormGroup';
import SpecialCharactersSelector from './configuration/SpecialCharactersSelector'
import _ from 'lodash';
import Paper from 'material-ui/Paper/Paper';
import Grid from 'material-ui/Grid/Grid';
import Typography from 'material-ui/Typography/Typography';

const ac = require('../acutils');

const { CHAR, QUEST_STAGE, QUEST_MAP } = MANIFEST.CONSTS;

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


class SquadVotingSection extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const lobbyMembers = this.props.lobby.members;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);

    const isMember = ac.is.squadMember(quest,currentUser._id),
      alreadyVoted = ac.is.squadVoting.doneFor(quest,currentUser._id);


    return (
      <Paper>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Button
              disabled={isMember === false || alreadyVoted}
              onClick={() => this.props.questVote(true)}
            >SUCCESS</Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={isMember === false || alreadyVoted}
              onClick={() => this.props.squadVote(false)}
            >FAIL</Button>
          </Grid>
        </Grid>

      </Paper>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    lobby: state.lobby,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  squadVote: (vote) => dispatch(squadVote(vote)),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(SquadVotingSection)
);
