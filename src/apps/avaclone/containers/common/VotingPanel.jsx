import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Grid from 'material-ui/Grid/Grid';



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
  undoButton: {
    position: 'absolute',
    bottom: '10px',
    right: '50px'
  },
  undoButtonDisabled: {
    position: 'absolute',
    color: '#CCC',
    bottom: '10px',
    right: '50px'
  },
  clearButton: {
    position: 'absolute',
    bottom: '10px',
    right: '90px'
  },
  paletteButton: {
    position: 'absolute',
    bottom: '10px',
    right: '10px'
  },
  canvasContainer: {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    backgroundColor: '#fff'
  }
});


class VotingPanel extends React.Component {

  render() {
    return (
      <Grid container spacing={0} justify="center">
        <Grid item xs={6}>
          <Button
            fab
            color="primary"
            aria-label="pro"
            disabled={this.props.disabled}
            onClick={() => this.props.onVote(true)}
          >
            {this.props.proIcon}
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fab
            color="primary"
            aria-label="con"
            disabled={this.props.disabled}
            onClick={() => this.props.onVote(false)}
          >
            {this.props.conIcon}
          </Button>
        </Grid>
      </Grid>
    );
  }
}


export default withStyles(styles)(VotingPanel);
