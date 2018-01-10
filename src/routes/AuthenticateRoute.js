import React, { Component } from 'react';
import { connect } from "react-redux";
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper/Paper';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import CredentialsForm from '../components/CredentialsForm';
import { register, login } from '../logic/user/actions'
import UserAppWrapper from '../containers/UserAppWrapper';


class AuthenticateRoute extends Component {
  render() {
    return (
      <UserAppWrapper>
        <Grid container spacing={16}>
          <Grid item xs={12} sm={6}>
            <AppBar position="static" color="default">
              <Typography type="title" color="inherit">Create account</Typography>
            </AppBar>
            <Paper>
              <CredentialsForm title="Register" onSubmit={this.props.register} submitValue="Register" />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <AppBar position="static" color="default">
              <Typography type="title" color="inherit">Log in</Typography>
            </AppBar>
            <Paper>
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

export default connect(null, mapDispatchToProps)(AuthenticateRoute);
