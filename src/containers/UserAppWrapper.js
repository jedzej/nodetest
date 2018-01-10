import React, { Component } from 'react';
import { connect } from "react-redux";
import TopBar from '../containers/TopBar'
import { webSocketOpen, WEBSOCKET_NOT_INITIALIZED } from '../webSocketMiddleware';
import { sessionIntent } from '../logic/user/actions';


class UserAppWrapper extends Component {

  componentDidMount() {
    if (this.props.websocket === WEBSOCKET_NOT_INITIALIZED){
      this.props.userSessionIntent();
      this.props.webSocketOpen();
    }
  }

  render() {
    return (
      <div className="App">
        <TopBar/>
        {this.props.children}
      </div>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    websocket: state.websocket
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    webSocketOpen: () => dispatch(webSocketOpen()),
    userSessionIntent: () => dispatch(sessionIntent())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserAppWrapper);
