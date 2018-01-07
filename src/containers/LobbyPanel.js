import React, { Component } from 'react';
import { connect } from "react-redux";
import { create, join, leave, list } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'

class LobbyPanel extends Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(event) {
    event.preventDefault();
  }

  renderNotLoggedIn() {
    return (
      <div>Not logged in</div>
    );
  }

  renderInLobby() {
    return (
      <div>
        Logged in as {this.props.user.name} <br />
        In lobby with
        <ul>
          {this.props.lobby.members.map(m =>
            <li key={m.id}>{m.name}</li>
          )}
        </ul>
        <button onClick={() => this.props.message("LOL")}>MESSAGE</button><br />
        <button onClick={this.props.leave}>LEAVE LOBBY</button>
      </div>
    );
  }

  renderNoLobby() {
    return (
      <div>
        Logged in as {this.props.user.name} <br />
        No lobby<br />
        Join lobby:
        <ul>
          {this.props.lobby.lobbiesList.map(lobby =>
            <li key={lobby.token}>
              <span>{lobby.members[0].name}</span>
              <button onClick={() => this.props.join(lobby.token)}>JOIN</button>
            </li>
          )}
        </ul>
        Or create:<br />
        <button onClick={this.props.create}>CREATE LOBBY</button>
      </div>
    );
  }

  render() {
    if (this.props.user.loggedIn === false) {
      return this.renderNotLoggedIn();
    }
    else if (this.props.lobby.exists == false) {
      return this.renderNoLobby();
    }
    else {
      return this.renderInLobby();
    }
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  create: () => {
    dispatch(create());
  },
  leave: () => {
    dispatch(leave());
  },
  join: (token) => {
    dispatch(join(token));
  },
  list: () => {
    dispatch(list());
  },
  message: (msg) => {
    dispatch(message(msg));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(LobbyPanel);