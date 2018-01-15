import React, { Component } from 'react';
import { connect } from "react-redux";
import LobbyPanel from '../containers/LobbyPanel'
import AppSelector from '../components/AppSelector';
import RspApp from '../apps/rsp/containers/RspApp'
import AppLayout from '../containers/AppLayout';
import AppLayoutPartial from '../containers/AppLayoutPartial';
import TopBar from '../containers/TopBar';

class InLobbyRoute extends Component {

  render() {
    const exclusiveApp = this.props.app.filter(app => app.isExclusive)[0];

    const app_map = {
      'rsp': () => <RspApp />
    }
    return (
      <AppLayout>
        <AppLayoutPartial key="drawer">
          <LobbyPanel />
        </AppLayoutPartial>
        <AppLayoutPartial key="top">
          <TopBar />
        </AppLayoutPartial>
        <AppLayoutPartial key="main">
          {(exclusiveApp === undefined ? <AppSelector /> : app_map[exclusiveApp.name]())}
        </AppLayoutPartial>
      </AppLayout>
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
