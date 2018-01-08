import React, { Component } from 'react';
import './App.css';
import LoginForm from 'components/LoginForm'
import RegisterForm from 'components/RegisterForm'
import HelloButton from 'components/HelloButton'
import LobbyPanel from '../containers/LobbyPanel'
import LogoutButton from 'components/LogoutButton'
import ChatBox from "containers/ChatBox"
import { connect } from "react-redux";
import TopBar from '../containers/TopBar'
import CredentialsForm from '../components/CredentialsForm';
import AuthenticatePage from '../containers/AuthenticatePage';
import LobbySelectionPage from '../containers/LobbySelectionPage';
import { register, login } from '../logic/user/actions'
import InLobbyPage from './InLobbyPage';


class App extends Component {

  renderNotLoggedIn() {
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

  renderNoLobby() {
    return (
      <div>
        <LobbyPanel />
        <LogoutButton />
      </div>
    )
  }

  renderInLobby() {
    return (
      <div>
        MY APP HERE
      </div>
    )
  }

  render() {
    var innerTemplate;
    if (this.props.user.loggedIn === false) {
      var innerTemplate = (<AuthenticatePage />);
    } else if (this.props.lobby.exists == false) {
      var innerTemplate = (<LobbySelectionPage />);
    } else {
      var innerTemplate = (<InLobbyPage />);
    }
    return (
      <div className="App">
        <TopBar />
        {innerTemplate}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby,
  };
};


const mapDispatchToProps = (dispatch) => {
  return {
    register: (name, password) => dispatch(register(name, password)),
    login: (name, password) => dispatch(login(name, password))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
