import React, { Component } from 'react';
import { connect } from "react-redux";
import ListItemText from 'material-ui/List/ListItemText';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import AccountCircle from 'material-ui-icons/AccountCircle'
import StarBorder from 'material-ui-icons/StarBorder'
import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography/Typography';
import Avatar from 'material-ui/Avatar/Avatar';

import { join, leave, kick } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'
import ChatBox from './ChatBox';
import withStyles from 'material-ui/styles/withStyles';



const styles = theme => ({
  header: {
    flex: '0 1 auto'
  },
  container: {
    height: '100vh',
    display: 'flex',
    flexFlow: 'column',
    flex: '0 1 auto',
  },
  chatContainer: {
    flex: '1 1 10px',
    overflowY:'hidden'
  }
});

const LobbyList = props => (
  <List>
    {props.members.map(m => {
      const isLeader = m._id === props.leaderId;
      return (
        <ListItem button key={m._id}>
          <ListItemAvatar>
            <Avatar>
              {isLeader ? <StarBorder /> : <AccountCircle />}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={m.name}
            secondary={isLeader ? 'Leader' : null}
            onClick={() => props.onClick(m._id)}
          />
        </ListItem>
      );
    })}
  </List>
);

class LobbyPanel extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <header>
          <Typography type="headline">
            lobby members
          </Typography>
          <Divider />
          <LobbyList
            leaderId={this.props.lobby.leaderId}
            members={this.props.lobby.members}
            onClick={(memberId) => this.props.kick(memberId)}
          />
          <Divider />
        </header>
          <Typography type="headline">
            lobby shoutbox
            </Typography>
        <section className={classes.chatContainer}>
          <ChatBox withFormBox />
        </section>
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
  },
  kick: id => dispatch(kick(id))
})


export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(LobbyPanel)
);
