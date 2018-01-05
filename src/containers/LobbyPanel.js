import React, { Component } from 'react';
import { connect } from "react-redux";
import { create, join, leave, list } from '../logic/lobby/actions'

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
      <div>In lobby</div>
    );
  }

  renderNoLobby() {
    return (
      <div>
        Logged in as {this.props.user.name} <br />
        No lobby<br />
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
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(LobbyPanel);