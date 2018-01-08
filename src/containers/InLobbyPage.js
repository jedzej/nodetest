import React, { Component } from 'react';
import LobbyPanel from './LobbyPanel'
class LobbyPage extends Component {

  render() {
    return (
      <div className="row">
        <div className="four columns">
          <LobbyPanel />
        </div>
        <div className="eight columns">
          <h5>MY APP HERE</h5>
        </div>
      </div>
    );
  }
}



export default LobbyPage;