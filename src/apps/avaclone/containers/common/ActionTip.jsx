import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Grid from 'material-ui/Grid';

import { terminate } from '../../../../logic/app/actions';
import { logout } from '../../../../logic/user/actions';
import { leave } from '../../../../logic/lobby/actions';

import QuestIcon from '../quest/QuestIcon';
import MANIFEST from '../../manifest';
import Typography from 'material-ui/Typography';

const ac = require('../../acutils');
const { STAGE, QUEST_STAGE } = MANIFEST.CONSTS


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
  }
});

class ActionTip extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const lobbyMembers = this.props.lobby.members;
    const currentUser = this.props.user;
    const stage = store.stage;
    const quest = ac.get.currentQuest(store);
    const questStage = quest && quest.stage;
    const commander = lobbyMembers.find(m => ac.is.commander(store, m._id));

    let primary = "", secondary = "";
    if (ac.is.inStage(store, STAGE.QUEST_SELECTION)) {
      primary = `commander ${commander.name} choses quest`;
      secondary = ac.is.commander(store, currentUser._id) ?
        "do your job!" : "wait for commander"
    }
    else if (ac.is.inStage(store, STAGE.SQUAD_PROPOSAL)) {
      primary = `commander ${commander.name} choses quest`;
      secondary = ac.is.commander(store, currentUser._id) ?
        "do your job!" : "wait for commander's decision"
    }
    else if (ac.is.inStage(store, STAGE.SQUAD_VOTING)) {
      primary = "everybody votes for proposed squad";
      secondary = ac.is.squadMember(quest, currentUser._id) ?
        "vote, you're in squad" : "vote, you're not in squad"
    }
    else if (ac.is.inStage(store, STAGE.QUEST_VOTING)) {
      primary = "squad members execute the quest";
      secondary = ac.is.squadMember(quest, currentUser._id) ?
        "do your job!" : ""
    }

    return (
      <Grid>
        <Typography align="center" type="subheader">
          {primary}
        </Typography>
        <Typography align="center" type="caption">
          {secondary}
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


export default withStyles(styles)(
  connect(mapStateToProps, null)(ActionTip)
);
