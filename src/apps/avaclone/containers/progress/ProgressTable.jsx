import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Grid from 'material-ui/Grid/Grid';

import QuestIcon from '../quest/QuestIcon';


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


class ProgressTable extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    return (
      <Grid container spacing={0}>
        {Object.values(store.quests).map(quest =>
          <Grid item>
            <QuestIcon stage={quest.stage} />
          </Grid>
        )}
      </Grid>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone
});


export default withStyles(styles)(
  connect(mapStateToProps, null)(ProgressTable)
);
