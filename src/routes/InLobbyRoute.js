import React, { Component } from 'react';
import { connect } from "react-redux";
import LobbyPanel from '../containers/LobbyPanel'
import UserAppWrapper from '../containers/UserAppWrapper';
import AppSelector from '../components/AppSelector';
import RspApp from '../apps/rsp/containers/RspApp'

class InLobbyRoute extends Component {

  render() {
    const exclusiveApp = this.props.app.filter(app => app.isExclusive)[0];

    const app_map = {
      'rsp': () => <RspApp/>
    }

    return (
      <UserAppWrapper>
        <div className="row">
          <div className="lobby left">
            <LobbyPanel />
          </div>
          <div className="lobby right">
            {(exclusiveApp === undefined ? <AppSelector /> : app_map[exclusiveApp.name]())}
          </div>
        </div>
      </UserAppWrapper>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  rsp_test: () => dispatch({
    type: "WEBSOCKET_WRITE",
    payload: {
      type: "RSP_COUNT_UP"
    }
  })
})

const mapStateToProps = (state) => {
  return {
    lobby: state.lobby,
    user: state.user,
    app: state.app
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(InLobbyRoute);
