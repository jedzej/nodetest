import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper/Paper';
import Typography from 'material-ui/Typography';
import CredentialsForm from '../components/CredentialsForm';
import { register, login } from '../logic/user/actions'
import UserAppWrapper from '../containers/UserAppWrapper';
import withStyles from 'material-ui/styles/withStyles';


const styles = theme => ({
  formBox: {
    margin: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 3
  }
});

class AuthenticateRoute extends Component {
  render() {
    const { classes } = this.props;
    return (
      <UserAppWrapper>
        <Grid id="tutaj" container spacing={0}>
          <Grid id="tutaj_tez" item xs={12} md={6}>
            <Paper className={classes.formBox}>
              <Typography type="title" color="inherit">Create account</Typography>
              <CredentialsForm title="Register" onSubmit={this.props.register} submitValue="Register" />
            </Paper>
          </Grid>
          <Grid item sm={12} md={6}>
            <Paper className={classes.formBox}>
              <Typography type="title" color="inherit">Log in</Typography>
              <CredentialsForm onSubmit={this.props.login} submitValue="Login" />
            </Paper>
          </Grid>
        </Grid>
      </UserAppWrapper>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    register: (name, password) => dispatch(register(name, password)),
    login: (name, password) => dispatch(login(name, password))
  };
};

export default withStyles(styles)(
  connect(null, mapDispatchToProps)(AuthenticateRoute)
);
