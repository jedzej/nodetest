import React, { Component } from 'react';
import { connect } from "react-redux";
import LobbyPanel from '../containers/LobbyPanel'
import AppSelector from '../components/AppSelector';
import AppLayout from '../containers/AppLayout';
import AppLayoutPartial from '../containers/AppLayoutPartial';
import TopBar from '../containers/TopBar';
import applications from '../applications'


class InLobbyRoute extends Component {

  render() {
    const exclusiveApp = Object.values(this.props.app).find(app => app.exclusive);
    const app = exclusiveApp ? applications[exclusiveApp.name] : null;
    console.log(app)

    if (app && app.MANIFEST.FULLSCREEN === true) {
      return <app.MAIN />
    } else {
      return (
        <AppLayout>
          <AppLayoutPartial key="drawer">
            <LobbyPanel />
          </AppLayoutPartial>
          <AppLayoutPartial key="top">
            <TopBar />
          </AppLayoutPartial>
          <AppLayoutPartial key="main">
            {app ? <app.MAIN /> : <AppSelector />}
          </AppLayoutPartial>
        </AppLayout>
      );
    }
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
