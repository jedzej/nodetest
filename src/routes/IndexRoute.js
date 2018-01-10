import React, { Component } from 'react';
import { connect } from 'react-redux';
import AuthenticateRoute from './AuthenticateRoute';
import NoLobbyRoute from './NoLobbyRoute';
import InLobbyRoute from './InLobbyRoute';

class IndexRoute extends Component {

  render() {
    if (this.props.user.loggedIn === false) {
      return (<AuthenticateRoute />);
    } else if (this.props.lobby.exists === false) {
      return (<NoLobbyRoute />);
    } else {
      return (<InLobbyRoute />);
    }
  }
}

const mapStateToProps = (state) => {
  return {
    lobby: state.lobby,
    user: state.user
  };
};

export default connect(mapStateToProps, null)(IndexRoute);
