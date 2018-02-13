import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { questVote } from '../actions';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Grid from 'material-ui/Grid/Grid';
import ThumbUp from 'material-ui-icons/ThumbUp';
import ThumbDown from 'material-ui-icons/ThumbDown';
import ProgressTable from './progress/ProgressTable';
import QuestInfo from './quest/QuestInfo';
import MembersTable from './members/MembersTable';
import VotingPanel from './common/VotingPanel';

const ac = require('../acutils');

const styles = theme => ({
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
});


class StageQuestVotingView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);

    const isSquadMember = ac.is.squadMember(quest, currentUser._id);
    const alreadyVoted = ac.is.questVoting.doneFor(quest, currentUser._id);

    return (
      <Paper>
        <ProgressTable />
        <QuestInfo questNumber={quest.number} />
        <MembersTable />
        <VotingPanel
          disabled={isSquadMember === false || alreadyVoted}
          conIcon={<ThumbDown />}
          proIcon={<ThumbUp />}
          onVote={this.props.questVote}
        />
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
  questVote: (vote) => dispatch(questVote(vote)),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageQuestVotingView)
);
