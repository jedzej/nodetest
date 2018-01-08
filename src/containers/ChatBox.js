import React, { Component } from 'react';
import { connect } from "react-redux";
import { message } from '../logic/chat/actions'
import dateFormat from 'dateformat'

const ChatEntry = (props) => (
  <div className="chat-entry">
    <div className="row">
      <span className="six columns chat-entry-author"><strong>{props.author}:</strong></span>
      <span className="six columns chat-entry-timestamp">
        <em>{dateFormat(props.timestamp, "hh:MM:ss")}</em>
      </span>
    </div>
    <div className="chat-entry-message">{props.message}</div>
  </div>
)

class ChatBox extends Component {

  handleSubmit(event) {
    if (this.messageInput.value.length > 0) {
      this.props.sendMessage(this.messageInput.value);
      this.messageInput.value = '';
    }
    this.messageInput.focus();
    event.preventDefault();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.chat.messages.length > prevProps.chat.messages.length)
      this.messageBox.scrollTo(0, this.messageBox.scrollHeight);
  }

  render() {
    return (
      <div className="chat-box">
        <div className="chat-message-box" ref={element => { this.messageBox = element }}>
          <hr />
          {this.props.chat.messages.map(m =>
            <div key={m.timestamp}>
              <ChatEntry author={m.from.name} message={m.message} timestamp={m.timestamp} />
              <hr />
            </div>
          )}
        </div>
        <div className="chat-form-box">
          <form onSubmit={event => this.handleSubmit(event)} autoComplete="off">
            <input type="text" className="chat-input-message" name="message"
              ref={element => { this.messageInput = element }} />
            <input className="chat-input-submit" type="submit" value="&#8626;" autoComplete="off" />
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    chat: state.chat,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    sendMessage: (msg) => {
      dispatch(message(msg));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox);