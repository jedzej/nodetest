import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider';

import ActionTip from './common/ActionTip';
import ProgressTable from './progress/ProgressTable';
import QuestInfo from './quest/QuestInfo';


const ac = require('../acutils');


const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    height: '100%',
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});


class StageWrapper extends React.Component {

  render() {
    const { classes } = this.props;
    const { store } = this.props.avaclone;
    const quest = ac.get.currentQuest(store);

    return (
      <div style={{ margin: 0, height: '100%' }}>
        <div style={{ margin: 0, overflow: 'auto' }}>
          {quest &&
            <Paper className={classes.paper}>
              <QuestInfo strong align="center" questNumber={quest.number} />
            </Paper>
          }
          <Paper className={classes.paper}>
            <ActionTip />
            <Divider className={classes.divider} />
            {this.props.children}
          </Paper>
          <Paper className={classes.paper}>
            <ProgressTable />
          </Paper>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone
});

export default withStyles(styles)(
  connect(mapStateToProps, null)(StageWrapper)
);
