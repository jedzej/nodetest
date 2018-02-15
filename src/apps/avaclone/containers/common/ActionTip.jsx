import React from 'react';
import { connect } from "react-redux";
import Grid from 'material-ui/Grid';

import MANIFEST from '../../manifest';
import Typography from 'material-ui/Typography';

const ac = require('../../acutils');
const { STAGE } = MANIFEST.CONSTS


class ActionTip extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const lobbyMembers = this.props.lobby.members;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);
    const commander = lobbyMembers.find(m => ac.is.commander(store, m._id));
    const attempts = quest && ac.get.squadAttemptsCount(quest) + 1;
    const attemptsLimit = ac.get.squadAttemptsLimit(store);

    let primary = "", secondary = "", mention = "";
    if (ac.is.inStage(store, STAGE.QUEST_SELECTION)) {
      primary = `commander ${commander.name} choses quest`;
      secondary = ac.is.commander(store, currentUser._id) ?
        "do your job, sir!" : "wait for commander's decision"
    }
    else if (ac.is.inStage(store, STAGE.SQUAD_PROPOSAL)) {
      primary = `commander ${commander.name} proposes squad`;
      secondary = ac.is.commander(store, currentUser._id) ?
        "do your job, sir!" : "wait for commander's decision";
      mention = attempts < attemptsLimit ?
        `attempt ${attempts}/${attemptsLimit}` : 'last attempt!'
    }
    else if (ac.is.inStage(store, STAGE.SQUAD_VOTING)) {
      primary = "everybody votes for proposed squad";
      secondary = ac.is.squadMember(quest, currentUser._id) ?
        "vote, you're in squad" : "vote, you're not in squad";
      mention = attempts < attemptsLimit ?
        `attempt ${attempts}/${attemptsLimit}` : 'last attempt!'
    }
    else if (ac.is.inStage(store, STAGE.QUEST_VOTING)) {
      primary = "squad members execute the quest";
      secondary = ac.is.squadMember(quest, currentUser._id) ?
        "do your job!" : "keep fingers crossed!"
    }

    return (
      <Grid>
        <Typography align="center" type="subheading">
          {primary}
        </Typography>
        <Typography align="center" type="caption">
          {secondary}
        </Typography>
        <Typography align="center" type="caption">
          {mention}
        </Typography>
      </Grid>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});


export default connect(mapStateToProps, null)(ActionTip);
