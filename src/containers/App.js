import React, { Component } from 'react';
import './App.css';
import LoginForm from 'components/LoginForm'
import RegisterForm from 'components/RegisterForm'
import HelloButton from 'components/HelloButton'
import LobbyPanel from 'containers/LobbyPanel'


class App extends Component {
  render() {
    return (
      <div className="App">
        <LobbyPanel />
        <RegisterForm/>
        <LoginForm />
        <HelloButton />
      </div>
    );
  }
}

export default App;
