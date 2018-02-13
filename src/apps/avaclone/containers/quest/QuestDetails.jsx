import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import PropTypes from 'prop-types';

import ThumbsUpDown from 'material-ui-icons/ThumbsUpDown';
import DriveEta from 'material-ui-icons/DriveEta';
import Grade from 'material-ui-icons/Grade';
import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Typography from 'material-ui/Typography/Typography';
import MANIFEST from '../../manifest';
import Grid from 'material-ui/Grid/Grid';
import QuestIcon from '../quest/QuestIcon';
import List, { ListItem } from 'material-ui/List';
import ListItemText from 'material-ui/List/ListItemText';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';

const ac = require('../../acutils');
const { QUEST_STAGE } = MANIFEST.CONSTS;

const styles = theme => ({
  tableContainer: {
    padding: '30px',
    margin: '20px'
  },
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


class QuestDetails extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const { members } = this.props.lobby;
    const { classes, actions } = this.props;
    const quest = ac.get.currentQuest(store);
    return (
      <Grid className={classes.tableContainer}>
        <Table>
          <TableBody>
            {members.map(member => {
              const hasVotedForSquad = ac.is.squadVoting.doneFor(quest, member._id);
              const isCommander = ac.is.commander(store, member._id);
              const isSquadMember = ac.is.squadMember(quest, member._id);
              const hasVotedForQuest = isSquadMember &&
                ac.is.questVoting.doneFor(quest, member._id);

              return (
                <TableRow key={member._id}>
                  <TableCell padding="none">{member.name}</TableCell>
                  {actions && actions.map(action => (
                    <TableCell padding="none">{action(member._id)}</TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
    );
  }
}

QuestDetails.propTypes = {
  onVote: PropTypes.func.required,
  actions: PropTypes.array
};


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    lobby: state.lobby,
    user: state.user
  };
};


export default withStyles(styles)(
  connect(mapStateToProps, null)(QuestDetails)
);
