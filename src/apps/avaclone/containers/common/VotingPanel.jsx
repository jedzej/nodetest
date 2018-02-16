import React from 'react';
import withStyles from 'material-ui/styles/withStyles';

import Button from 'material-ui/Button/Button';
import Grid from 'material-ui/Grid/Grid';


const styles = theme => ({
  buttonContainer: {
    textAlign: 'center'
  },
  button: {
    margin: theme.spacing.unit,
  }
});


class VotingPanel extends React.Component {

  render() {
    const { classes } = this.props;
    const ProButton = () => (
      <Button
        fab
        color="primary"
        aria-label="pro"
        disabled={this.props.disabled}
        onClick={() => this.props.onVote(true)}
        className={classes.button + " " + this.props.proClass}
      >
        {this.props.proIcon}
      </Button>
    );
    const ConButton = () => (
      <Button
        fab
        color="primary"
        aria-label="con"
        disabled={this.props.disabled}
        onClick={() => this.props.onVote(false)}
        className={classes.button + " " + this.props.conClass}
      >
        {this.props.conIcon}
      </Button>
    )
    return (
      <Grid container spacing={0} justify="center">
        <Grid item xs={12} className={classes.buttonContainer}>
          {!this.props.swapped && <ProButton />}
          <ConButton />
          {this.props.swapped && <ProButton />}
        </Grid>
      </Grid>
    );
  }
}


export default withStyles(styles)(VotingPanel);
