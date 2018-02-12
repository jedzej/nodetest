import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { squadVote } from '../actions';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Grid from 'material-ui/Grid/Grid';

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


class SquadVotingSection extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);

    const alreadyVoted = ac.is.squadVoting.doneFor(quest, currentUser._id);
    console.log('already voted:', alreadyVoted)

    return (
      <Paper>
        <Grid container spacing={0}>
          <Grid item xs={6}>
            <Button
              disabled={alreadyVoted}
              onClick={() => this.props.squadVote(true)}
            >SUCCESS</Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              disabled={alreadyVoted}
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
