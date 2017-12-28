import React, { Component } from 'react';
import './App.css';
import { RegisterForm, LoginForm } from 'components/AuthForms'
import HelloButton from 'components/HelloButton'
import LobbyPanel from 'containers/LobbyPanel'
import * as sapiClient from 'api/sapi/client'
import authSapi from 'api/sapi/auth'


class App extends Component {
  constructor(props) {
    super(props);
    sapiClient.initialize("ws:/localhost:3004");
  }

  registerSubmit(name, password) {
    authSapi.register(name, password).then(
      function(resolveRsp){
        alert('User registered!');
      }
    ).catch(
      function (rejectRsp) {
        alert(rejectRsp.error.message);
      }
    );
  }

  loginSubmit(name, password) {
    authSapi.login(name, password).then(
      function(user){
        alert('User ' + user.name + ' logged in!');
      }
    ).catch(
      function (rejectRsp) {
        alert(rejectRsp.error.message);
      }
    );
  }

  render() {
    return (
      <div className="App">
        <LobbyPanel />
        <RegisterForm onsubmit={this.registerSubmit} />
        <LoginForm onsubmit={this.loginSubmit} />
        <HelloButton />
      </div>
    );
  }
}

export default App;
