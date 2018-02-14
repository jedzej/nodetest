import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import ThumbDown from 'material-ui-icons/ThumbDown';
import ThumbUp from 'material-ui-icons/ThumbUp';
import DriveEta from 'material-ui-icons/DriveEta';
import Done from 'material-ui-icons/Done';

import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { squadVote } from '../actions';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Grid from 'material-ui/Grid/Grid';
import ProgressTable from './progress/ProgressTable';
import QuestInfo from './quest/QuestInfo';
import QuestDetails from './quest/QuestDetails';

const ac = require('../acutils');


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


class StageSquadVotingView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);

    const alreadyVoted = ac.is.squadVoting.doneFor(quest, currentUser._id);
    console.log('already voted:', alreadyVoted)

    return (
      <Paper>
        <ProgressTable />
        <QuestInfo questNumber={quest.number} />
        <QuestDetails
          actions={[
            (memberId) =>
              ac.is.squadMember(quest, memberId) && <DriveEta />,
            (memberId) =>
              ac.is.squadVoting.doneFor(quest, memberId) && <Done />
          ]}
        />
        <Grid container spacing={0} justify="center">
          <Grid item xs={6}>
            <Button
              fab
              color="primary"
              aria-label="pro"
              disabled={alreadyVoted}
              onClick={() => this.props.squadVote(true)}
            >
              <ThumbUp />
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fab
              color="primary"
              aria-label="con"
              disabled={alreadyVoted}
              onClick={() => this.props.squadVote(false)}
            >
              <ThumbDown />
            </Button>
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
  connect(mapStateToProps, mapDispatchToProps)(StageSquadVotingView)
);
