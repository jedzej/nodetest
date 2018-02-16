import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import withStyles from 'material-ui/styles/withStyles';

import Grid from 'material-ui/Grid/Grid';
import Typography from 'material-ui/Typography/Typography';
import Table, { TableBody, TableCell, TableRow } from 'material-ui/Table';


const ac = require('../../acutils');

const styles = theme => ({
  buttonContainer: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing.unit,
  },
  actionCell: {
    textAlign: 'right'
  }
});


class MembersList extends React.Component {

  render() {
    const { classes, caption, actions } = this.props;
    const members = ac.get.members(
      this.props.avaclone.store,
      this.props.lobby
    );
    return (
      <Grid className={classes.tableContainer}>
        <Table>
          <TableBody>
            {members.map(member => {
              return (
                <TableRow key={member._id}>
                  <TableCell padding="none">
                    <Typography type="subheading">
                      {member.name}
                    </Typography>
                    <Typography type="caption">
                      {caption && caption(member)}
                    </Typography>
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


MembersList.propTypes = {
  actions: PropTypes.array,
  caption: PropTypes.func
};


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});


export default withStyles(styles)(
  connect(mapStateToProps, null)(MembersList)
);
