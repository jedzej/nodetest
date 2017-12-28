import React, { Component } from 'react';
import lobbySapi from 'api/sapi/lobby'
import authSapi from 'api/sapi/auth'

class LobbyPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lobby: {},
      user: {}
    };
    this.authUpdate = this.authUpdate.bind(this);
    this.lobbyUpdate = this.lobbyUpdate.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
  }

  lobbyUpdate(event) {
    console.log("LOBBY/UPDATE")
    console.log(event)
    this.setState({ lobby: event })
  }

  authUpdate(event) {
    console.log("AUTH/UPDATE")
    console.log(event)
    this.setState({ user: event })
  }

  componentWillMount() {
    console.log('will mount');
    lobbySapi.addListener('update', this.lobbyUpdate);
    authSapi.addListener('update', this.authUpdate);
  }

  componentWillUnmount() {
    console.log('will unmount');
    lobbySapi.removeListener('update', this.lobbyUpdate);
    authSapi.removeListener('update', this.authUpdate);
  }

  handleCreate(event) {
    lobbySapi.create().then((response) => {
      console.log(response)
    });
    event.preventDefault();
  }

  renderNotLoggedIn() {
    return (
      <div>Not logged in</div>
    );
  }

  renderInLobby() {
    return (
      <div>In lobby</div>
    );
  }

  renderNoLobby() {
    return (
      <div>
        No lobby<br />
        <button onClick={this.handleCreate}>CREATE LOBBY</button>
      </div>
    );
  }

  render() {
    if (this.state.user.token === undefined) {
      return this.renderNotLoggedIn();
    }
    else if (this.state.lobby.id === undefined) {
      return this.renderNoLobby();
    }
    else {
      return this.renderInLobby();
    }
  }
}

export default LobbyPanel;