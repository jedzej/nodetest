import React, { Component } from 'react';
import { connect } from "react-redux";

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
        Logged in as {this.props.user.name} <br/>
        No lobby<br />
        <button onClick={this.handleCreate}>CREATE LOBBY</button>
      </div>
    );
  }

  render() {
    if (this.props.user.token === undefined) {
      return this.renderNotLoggedIn();
    }
    else if (this.props.lobby === undefined) {
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
  };
};

export default connect(mapStateToProps, null)(LobbyPanel);