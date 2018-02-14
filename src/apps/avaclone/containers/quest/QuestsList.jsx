import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { withStyles } from 'material-ui/styles';
import QuestInfo from './QuestInfo';
import Grid from 'material-ui/Grid';
import QuestIcon from './QuestIcon';
import List, { ListItem } from 'material-ui/List';

const styles = theme => ({
  root: {
    width: '90%',
  },
  button: {
    marginTop: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  actionsContainer: {
    marginBottom: theme.spacing.unit * 2,
  },
  resetContainer: {
    padding: theme.spacing.unit * 3,
  },
});

class QuestsList extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const { actions } = this.props;
    return (
      <List>
        {Object.values(store.quests).map(quest =>
          <ListItem >
            <Grid container>
              <Grid item>
                <QuestIcon stage={quest.stage} />
              </Grid>
              <Grid item>
                <QuestInfo questNumber={quest.number} />
              </Grid>
              <Grid item>
                {actions && actions.map(action => action(quest))}
              </Grid>
            </Grid>
          </ListItem>
        )}
      </List>
    );
  }
}

QuestsList.propTypes = {
  classes: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    lobby: state.lobby
  };
};



export default withStyles(styles)(
  connect(mapStateToProps, null)(QuestsList)
);
