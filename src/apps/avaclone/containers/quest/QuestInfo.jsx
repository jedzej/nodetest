import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import Typography from 'material-ui/Typography/Typography';
import MANIFEST from '../../manifest'
import Grid from 'material-ui/Grid/Grid';

const ac = require('../../acutils');

const { STAGE, QUEST_STAGE } = MANIFEST.CONSTS;

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

const QuestStage = props => (
  <Typography {...props}>
    Quest {props.number} - {
      props.questStage !== QUEST_STAGE.ONGOING ?
        ({
          [QUEST_STAGE.NOT_TAKEN]: "not taken",
          [QUEST_STAGE.SUCCESS]: "succeeded",
          [QUEST_STAGE.FAILURE]: "failed"
        })[props.questStage] :
        ({
          [STAGE.SQUAD_PROPOSAL]: "squad proposal",
          [STAGE.SQUAD_VOTING]: "squad voting",
          [STAGE.QUEST_VOTING]: "execution"
        })[props.stage]}
  </Typography>
);

class QuestInfo extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const quest = store.quests[this.props.questNumber];
    const failuresRequired = ac.get.failureCountRequired(store, quest);
    return (
      <Grid container spacing={0}>
        <Grid item xs={12} >
          <QuestStage
            type={this.props.strong ? "headline" : "subheading"}
            number={quest.number}
            questStage={quest.stage}
            stage={store.stage}
            align={this.props.align}
          />
          <Typography type="caption" align={this.props.align}>
            {ac.get.squadCountRequired(store, quest)} members required
          </Typography>
          <Typography type="caption" align={this.props.align}>
            {failuresRequired} failure{failuresRequired > 1 && 's'} to lose
          </Typography>
        </Grid>
      </Grid>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    lobby: state.lobby
  };
};



export default withStyles(styles)(
  connect(mapStateToProps, null)(QuestInfo)
);
