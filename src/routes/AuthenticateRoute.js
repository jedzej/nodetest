import React, { Component } from 'react';
import { connect } from "react-redux";
import CredentialsForm from '../components/CredentialsForm';
import { register, login } from '../logic/user/actions'
import UserAppWrapper from '../containers/UserAppWrapper';


class AuthenticateRoute extends Component {
  render() {
    return (
      <UserAppWrapper>
        <div className="row">
          <div className="six columns">
            <CredentialsForm title="Register" onSubmit={this.props.register} submitValue="Register" />
          </div>
          <div className="six columns">
            <CredentialsForm title="Login" onSubmit={this.props.login} submitValue="Login" />
          </div>
        </div>
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
