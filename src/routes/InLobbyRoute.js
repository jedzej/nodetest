import React, { Component } from 'react';
import LobbyPanel from '../containers/LobbyPanel'
import UserAppWrapper from '../containers/UserAppWrapper';

class InLobbyRoute extends Component {

  render() {
    return (
      <UserAppWrapper>
        <div className="row">
          <div className="lobby left">
            <LobbyPanel />
          </div>
          <div className="lobby right">
            <h5>MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
              MY APP HERE
            </h5>
          </div>
        </div>
      </UserAppWrapper>
    );
  }
}


export default InLobbyRoute;
