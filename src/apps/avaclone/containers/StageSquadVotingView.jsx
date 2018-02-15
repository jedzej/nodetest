import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import ThumbDown from 'material-ui-icons/ThumbDown';
import ThumbUp from 'material-ui-icons/ThumbUp';
import DriveEta from 'material-ui-icons/DriveEta';
import Done from 'material-ui-icons/Done';
import HourglassEmpty from 'material-ui-icons/HourglassEmpty';

import QuestDetails from './quest/QuestDetails';
import StageWrapper from './StageWrapper';
import VotingPanel from './common/VotingPanel';

import { squadVote } from '../actions';

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

    return (
      <StageWrapper>
        <QuestDetails
          actions={[
            (memberId) =>
              ac.is.squadMember(quest, memberId) && <DriveEta />,
            (memberId) =>
              ac.is.squadVoting.doneFor(quest, memberId) ?
                <Done /> : <HourglassEmpty />
          ]}
        />
        <VotingPanel
          onVote={this.props.squadVote}
          disabled={alreadyVoted}
          proIcon={<ThumbUp />}
          conIcon={<ThumbDown />}
        />
      </StageWrapper>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  squadVote: (vote) => dispatch(squadVote(vote))
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageSquadVotingView)
);
