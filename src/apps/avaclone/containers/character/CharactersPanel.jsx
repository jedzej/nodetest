import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import { CircularProgress } from 'material-ui/Progress';

import Button from 'material-ui/Button/Button';
import Grid from 'material-ui/Grid/Grid';
import CharactersList from './CharactersList';
import Fingerprint from 'material-ui-icons/Fingerprint';

const ac = require('../../acutils');

const styles = theme => ({
  buttonContainer: {
    textAlign: 'center',
    //position:'relative',
  },
  button: {
  },
  fabProgress: {
    margin: theme.spacing.unit,
    color: 'green',
    //position: 'absolute',
    /*top: -6,
    left: -6,
    zIndex: 1,*/
  }
});


class CharactersPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expose: false, progress: 0 };
    this.interval = null;
  }

  handleClick(event) {
    this.setState({ expose: true, progress: 0 });
    this.interval = setInterval(() => this.handleInterval(), 50)
    console.log('clicked')
  }

  handleInterval() {
    this.setState({ progress: this.state.progress + 1.5 });
    if (this.state.progress >= 100) {
      this.setState({ expose: false, progress: 0 });
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
      this.setState({ expose: false, progress: 0 });
    }
  }

  render() {
    const { classes } = this.props;
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;

    return (
      <Grid container spacing={0} justify="center">
        <Grid item xs={12}>
          <CharactersList
            expose={this.state.expose}
            caption={(member) =>
              this.state.expose ?
                ac.get.charFor(store, currentUser._id, member._id) : 'pleb'}
          />
        </Grid>
        <Grid item xs={12} className={classes.buttonContainer}>
          <Button
            fab
            color="accent"
            aria-label="expose identity"
            disabled={this.state.expose}
            onClick={(event) => this.handleClick(event)}
            className={classes.buttonProgress}
          >
            {this.state.expose === false && <Fingerprint />}
            {this.state.expose &&
              <CircularProgress
                className={classes.fabProgress}
                mode="determinate"
                value={this.state.progress}
              />}
          </Button>
        </Grid>
      </Grid>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  user: state.user
});


export default withStyles(styles)(
  connect(mapStateToProps, null)(CharactersPanel)
);
