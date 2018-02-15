import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import PropTypes from 'prop-types';

import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid/Grid';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';

const ac = require('../../acutils');

const styles = theme => ({
  tableContainer: {
    //padding: '30px',
    //margin: '20px'
  },
  actionCell: {
    textAlign: 'right'
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
              const isCommander = ac.is.commander(store, member._id);
              const isSquadMember = ac.is.squadMember(quest, member._id);
              const roles = [];
              if (isCommander) roles.push('commander');
              if (isSquadMember) roles.push('in squad');
              if (roles.length === 0) roles.push('pleb')

              return (
                <TableRow key={member._id}>
                  <TableCell padding="none">
                    <Typography type="subheading">{member.name}</Typography>
                    <Typography type="caption">{roles.join(', ')}</Typography>
                  </TableCell>
                  <TableCell className={classes.actionCell} padding="none">
                    {actions && actions.map((action, i) =>
                      <span key={i}>
                        {action(member._id)}
                      </span>)}
                  </TableCell>
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
