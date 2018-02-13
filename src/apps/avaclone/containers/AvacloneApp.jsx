import React from 'react';
import { connect } from "react-redux";

import StageConfigurationView from './StageConfigurationView';
import StageQuestSelectionView from './StageQuestSelectionView';
import StageSquadProposalView from './StageSquadProposalView';
import StageSquadVotingView from './StageSquadVotingView';
import StageQuestVotingView from './StageQuestVotingView';
import StageCompleteView from './StageCompleteView';
import MANIFEST from '../manifest'


const { STAGE } = MANIFEST.CONSTS;


class AvacloneApp extends React.Component {
  render() {
    switch (this.props.avaclone.store.stage) {
      case STAGE.CONFIGURATION:
        return <StageConfigurationView />;
      case STAGE.QUEST_SELECTION:
        return <StageQuestSelectionView />;
      case STAGE.SQUAD_PROPOSAL:
        return <StageSquadProposalView />;
      case STAGE.SQUAD_VOTING:
        return <StageSquadVotingView />;
      case STAGE.QUEST_VOTING:
        return <StageQuestVotingView />;
      case STAGE.COMPLETE:
        return <StageCompleteView />;
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

export default connect(mapStateToProps, null)(AvacloneApp);
