import React, { Component } from 'react';
import { connect } from "react-redux";
import { join, leave } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'
import ChatBox from './ChatBox';

class LobbyPanel extends Component {

  render() {
    return (
      <div>
        In lobby with
        <ul>
          {this.props.lobby.members.map(m => <li key={m.id}>{m.name}</li>)}
        </ul>
        <button onClick={this.props.leave}>LEAVE LOBBY</button>
        <ChatBox withFormBox />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  leave: () => {
    dispatch(leave());
  },
  join: (token) => {
    dispatch(join(token));
  },
  message: (msg) => {
    dispatch(message(msg));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(LobbyPanel);