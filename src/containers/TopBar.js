import React, { Component } from 'react';
import HelloButton from 'components/HelloButton'
import LogoutButton from 'components/LogoutButton'
import { connect } from "react-redux";


class TopBar extends Component {

  renderNotLoggedIn() {
    return (
      <div>
        Not logged in
      </div>
    )
  }

  renderNoLobby() {
    return (
      <LogoutButton />
    );
  }

  renderInLobby() {
    return (
      <LogoutButton />
    );
  }

  render() {
    var partial;
    if (this.props.user.loggedIn === false) {
      partial = this.renderNotLoggedIn();
    } else if (this.props.lobby.exists === false) {
      partial = this.renderNoLobby();
    } else {
      partial = this.renderInLobby();
    }
    return (
      <div className="row">
        <div className="six columns">
          <HelloButton />
        </div>
        <div className="six columns">
          {partial}
        </div>
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

export default connect(mapStateToProps, null)(TopBar);