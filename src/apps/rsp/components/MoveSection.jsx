import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { ScissorsIcon, RockIcon, PaperIcon, RSPMoveIcon } from './RSPIcons';
import { RESULT, MOVE } from '../core';
import MutatorIcon from './MutatorIcon';
import Grid from 'material-ui/Grid/Grid';
import Button from 'material-ui/Button/Button';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: theme.spacing.unit * 3,
  },
  table: {
    //minWidth: 700,
  },
  buttonCell: {
    textAlign: 'center',
    width: '80px'
  },
  button: {
    width: '60%',
    height: '60%'
  }
});

class MoveSection extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <Grid container spacing={20} justify="center" className={classes.root}>
          <Grid item xs={12}>
            {this.props.children}
          </Grid>
          {Object.values(MOVE).map(move =>
            <Grid item xs className={classes.buttonCell} justify="center" key={move}>
              <Button fab disabled={this.props.disabled} color="primary" aria-label={move} onClick={() => this.props.onClick(move)}>
                <RSPMoveIcon move={move} className={classes.button} />
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    );
  }

}

MoveSection.propTypes = {
  classes: PropTypes.object.isRequired,
  disabled: PropTypes.bool,
  onClick: PropTypes.func
};

export default withStyles(styles)(MoveSection);
