import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Flag from 'material-ui-icons/Flag';
import Whatshot from 'material-ui-icons/Whatshot';
import DriveEta from 'material-ui-icons/DriveEta';
import Done from 'material-ui-icons/Done';
import HourglassEmpty from 'material-ui-icons/HourglassEmpty';

import VotingPanel from './common/VotingPanel';
import QuestDetails from './quest/QuestDetails';
import StageWrapper from './StageWrapper';

import { questVote } from '../actions';

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
  conButton: {
    backgroundColor: 'red',
  },
  proButton: {
    backgroundColor: 'green',
  }
});


class StageQuestVotingView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const { classes } = this.props;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);

    const isSquadMember = ac.is.squadMember(quest, currentUser._id);
    const alreadyVoted = ac.is.questVoting.doneFor(quest, currentUser._id);

    const showSquadMember = (memberId) =>
      ac.is.squadMember(quest, memberId) && <DriveEta />;

    const showVotingComplete = (memberId) => {
      const isMember = ac.is.squadMember(quest, memberId)
      const hasVoted = ac.is.squadMember(quest, memberId)
        && ac.is.questVoting.doneFor(quest, memberId);
      return (
        hasVoted ? <Done /> : isMember && <HourglassEmpty />
      );
    }

    const swap = Math.sin(parseInt(currentUser._id.substring(0, 10), 16) / quest.number) > 0;
    console.log(currentUser._id.substring(0, 10))
    console.log(parseInt(currentUser._id.substring(0, 10), 16))
    console.log(quest.number)

    return (
      <StageWrapper>
        <QuestDetails
          actions={[
            showSquadMember,
            showVotingComplete
          ]}
        />
        <VotingPanel
          swapped={swap}
          disabled={isSquadMember === false || alreadyVoted}
          conIcon={<Whatshot />}
          conClass={classes.conButton}
          proIcon={<Flag />}
          proClass={classes.proButton}
          onVote={this.props.questVote}
        />
      </StageWrapper>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  questVote: (vote) => dispatch(questVote(vote))
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageQuestVotingView)
);
