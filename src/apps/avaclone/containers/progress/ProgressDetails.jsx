import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import List, { ListItem, ListItemText } from 'material-ui/List';

import { terminate } from '../../../../logic/app/actions';
import { logout } from '../../../../logic/user/actions';
import { leave } from '../../../../logic/lobby/actions';

import QuestIcon from '../quest/QuestIcon';

const ac = require('../acutils');


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


class ProgressDetails extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    return (
      <List>
        {Object.values(store.quests).map(quest => {
          const failuresRequired = ac.get.failureCountRequired(store, quest);
          const squadCountRequired = ac.get.squadCountRequired(store, quest);
          return (
            <ListItem>
              <QuestIcon stage={quest.stage} />
              <ListItemText
                primary={`Quest ${quest.number}`}
                secondary={`${failuresRequired}/${squadCountRequired} failures to lose`} />
            </ListItem>
          );
        })}
      </List>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  terminate: () => dispatch(terminate()),
  logout: () => dispatch(logout()),
  leave: () => dispatch(leave())
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(ProgressDetails)
);
