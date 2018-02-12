import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';

import MANIFEST from '../manifest'
import ConfigurationSection from '../containers/ConfigurationSection';
import QuestSelectionSection from './QuestSelectionSection';
import SquadProposalSection from './SquadProposalSection';
import SquadVotingSection from './SquadVotingSection';
import QuestVotingSection from './QuestVotingSection';
import CompleteView from './CompleteView';

const { STAGE } = MANIFEST.CONSTS;

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


class PaintApp extends React.Component {
  render() {
    switch (this.props.avaclone.store.stage) {
      case STAGE.CONFIGURATION:
        return <ConfigurationSection />;
      case STAGE.QUEST_SELECTION:
        return <QuestSelectionSection />;
      case STAGE.SQUAD_PROPOSAL:
        return <SquadProposalSection />;
      case STAGE.SQUAD_VOTING:
        return <SquadVotingSection />;
      case STAGE.QUEST_VOTING:
        return <QuestVotingSection />;
      case STAGE.COMPLETE:
        return <CompleteView />;
      default:
        return <div>UPS</div>;
    }
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone
  };
};

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(logout()),
  leave: () => dispatch(leave())
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(PaintApp)
);
