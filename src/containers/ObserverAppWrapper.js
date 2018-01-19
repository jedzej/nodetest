import React, { Component } from 'react';
import { connect } from "react-redux";
import { webSocketOpen, WEBSOCKET_NOT_INITIALIZED } from '../webSocketMiddleware';
import { sessionIntent } from '../logic/observer/actions';


class ObserverAppWrapper extends Component {

  componentDidMount() {
    if (this.props.websocket === WEBSOCKET_NOT_INITIALIZED){
      this.props.observerSessionIntent(this.props.token);
      this.props.webSocketOpen();
    }
  }

  render() {
    return (
      <div className="App">
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
    observerSessionIntent: (token) => dispatch(sessionIntent(token))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObserverAppWrapper);
