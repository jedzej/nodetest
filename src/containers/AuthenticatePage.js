import React, { Component } from 'react';
import { connect } from "react-redux";
import CredentialsForm from '../components/CredentialsForm';
import { register, login } from '../logic/user/actions'


class AuthenticatePage extends Component {

  render() {
    return (
      <div className="row">
        <div className="six columns">
          <h4>Register</h4>
          <CredentialsForm onSubmit={this.props.register} submitValue="Register" />
        </div>
        <div className="six columns">
          <h4>Login</h4>
          <CredentialsForm onSubmit={this.props.login} submitValue="Login" />
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    register: (name, password) => dispatch(register(name, password)),
    login: (name, password) => dispatch(login(name, password))
  };
};

export default connect(null, mapDispatchToProps)(AuthenticatePage);
