import React, { Component } from 'react';
import { connect } from 'react-redux';
import dateFormat from 'dateformat';
import withStyles from 'material-ui/styles/withStyles';
import TextField from 'material-ui/TextField';
import Send from 'material-ui-icons/Send';
import IconButton from 'material-ui/IconButton';
import Grid from 'material-ui/Grid/Grid';
import Typography from 'material-ui/Typography/Typography';

import { message } from '../logic/chat/actions';


const chatBoxStyles = theme => ({
  container: {
    width: '100%',
    height: '100%'
  },
  content: {
    height: 'calc(100% - 50px)',
    overflowY: 'scroll'
  },
  contentBody: {
    height: 'calc(100% - 50px)',
    overflowY: 'scroll'
  },
  messageInput: {
    width: 'calc(100% - 50px)'
  },
  footer: {
    height: '50px',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
  }
});

const chatEntryStyles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
});


class ChatEntry extends React.Component {
  render() {
    const { timestamp, author, message, classes } = this.props;
    return (
      <Grid container spacing={0} className={classes.root}>
        <Grid xs={8}>
          <Typography type='subheading'>
            {author}:
          </Typography>
        </Grid>
        <Grid xs={4}>
          <Typography type='caption' align='right'>
            {dateFormat(timestamp, 'HH:MM:ss')}
          </Typography>
        </Grid>
        <Grid xs={12}>
          <Typography>
            {message}
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

ChatEntry = withStyles(chatEntryStyles)(ChatEntry);

class ChatBox extends Component {
  constructor(props) {
    /*props.chat.messages = Array.apply(null, { length: 25 }).map(Number.call, Number).map(i => ({
      from: {
        name: 'aaa',
        _id: '12341234'
      },
      message: 'msg ' + i
    }))*/
    super(props);
    this.state = {
      'message': ''
    }
  }

  handleSubmit(event) {
    if (this.messageInput.value.length > 0) {
      this.props.sendMessage(this.messageInput.value);
    }
    this.setState({ 'message': '' })
    this.messageInput.focus();
    event.preventDefault();
  }

  handleChange(event) {
    if (this.messageInput === undefined)
      this.messageInput = event.target;
    this.setState({ 'message': this.messageInput.value })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.chat.messages.length > prevProps.chat.messages.length)
      this.messageBox.scrollTo(0, this.messageBox.scrollHeight);
  }

  render() {
    const { classes, chat } = this.props;
    return (
      <div className={classes.container}>
        <section className={classes.content} ref={e => this.messageBox = e}>
          {chat.messages.map((m, i) =>
            <div key={m.timestamp}>
              <ChatEntry
                author={m.from.name}
                message={m.message}
                timestamp={m.timestamp}
              />
            </div>
          )}
        </section>
        {(this.props.withFormBox ?
          <footer className={classes.footer}>
            <form
              onSubmit={event => this.handleSubmit(event)}
              autoComplete='off'
            >
              <TextField
                className={classes.messageInput}
                name='message'
                onChange={event => this.handleChange(event)}
                value={this.state.message}
                autoComplete='off' />
              <IconButton
                dense='true'
                color={this.state.message.length > 0 ? 'primary' : 'inherit'}
              >
                <Send />
              </IconButton>
            </form>
          </footer> : ''
        )}
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


export default withStyles(chatBoxStyles)(
  connect(mapStateToProps, mapDispatchToProps)(ChatBox)
);
