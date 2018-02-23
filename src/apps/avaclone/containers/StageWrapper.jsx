import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Paper from 'material-ui/Paper/Paper';
import Divider from 'material-ui/Divider';
import People from 'material-ui-icons/People'
import Settings from 'material-ui-icons/Settings'
import GpsNotFixed from 'material-ui-icons/GpsNotFixed'
import BottomNavigation, { BottomNavigationAction } from 'material-ui/BottomNavigation';

import ActionTip from './common/ActionTip';
import ProgressTable from './progress/ProgressTable';
import QuestInfo from './quest/QuestInfo';
import CharactersPanel from './character/CharactersPanel';


const ac = require('../acutils');


const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  }
});


class StageWrapper extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      tab: 'quest'
    };
  }

  handleChange = (event, value) => {
    this.setState({ tab: value });
  }

  render() {
    const { classes } = this.props;
    const { store } = this.props.avaclone;
    const quest = ac.get.currentQuest(store);
    const { tab } = this.state;

    return (
      <div style={{ margin: 0, height: '100%' }}>
        <div style={{ margin: 0, overflow: 'auto', height: 'calc(100% - 56px)' }}>
          {quest && tab === 'quest' &&
            <Paper className={classes.paper}>
              <QuestInfo strong align="center" questNumber={quest.number} />
            </Paper>
          }
          {tab === 'quest' &&
            <Paper className={classes.paper}>
              <ProgressTable />
            </Paper>
          }
          {tab === 'quest' &&
            <Paper className={classes.paper}>
              <ActionTip />
              <Divider className={classes.divider} />
              {this.props.children}
            </Paper>
          }
          {tab === 'squad' &&
            < Paper className={classes.paper}>
              <CharactersPanel />
            </Paper>
          }
        </div>
        <BottomNavigation value={tab} onChange={this.handleChange} className={classes.root}>
          <BottomNavigationAction label="quest" value="quest" icon={<GpsNotFixed />} />
          <BottomNavigationAction label="squad" value="squad" icon={<People />} />
          <BottomNavigationAction label="settings" value="settings" icon={<Settings />} />
        </BottomNavigation>
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
