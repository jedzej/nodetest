import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Grid from 'material-ui/Grid/Grid';
import MANIFEST from '../../manifest';
import QuestIcon from '../quest/QuestIcon';

const { QUEST_STAGE } = MANIFEST.CONSTS;

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

});

const COLORS = {
  [QUEST_STAGE.FAILURE]: 'red',
  [QUEST_STAGE.NOT_TAKEN]: 'grey',
  [QUEST_STAGE.SUCCESS]: 'green',
  [QUEST_STAGE.ONGOING]: 'black',
}

class ProgressTable extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    return (
      <Grid container spacing={0} justify="center">
        {Object.values(store.quests).map(quest =>
          <Grid item key={quest.number}>
            <QuestIcon
              style={{ color: COLORS[quest.stage] }}
              stage={quest.stage}
            />
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
