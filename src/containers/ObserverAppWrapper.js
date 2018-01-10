import React, { Component } from 'react';
import { connect } from "react-redux";
import { webSocketOpen, WEBSOCKET_NOT_INITIALIZED } from '../webSocketMiddleware';
import { sessionIntent } from '../logic/observer/actions';


class ObserverAppWrapper extends Component {

  componentDidMount() {
    if (this.props.websocket === WEBSOCKET_NOT_INITIALIZED){
      this.props.observerSessionIntent();
      this.props.webSocketOpen(this.props.token);
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
    observerSessionIntent: () => dispatch(sessionIntent())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ObserverAppWrapper);
