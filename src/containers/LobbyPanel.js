import React, { Component } from 'react';
import { connect } from "react-redux";
import { join, leave, kick } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'
import ChatBox from './ChatBox';
import ListItemText from 'material-ui/List/ListItemText';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import AccountCircle from 'material-ui-icons/AccountCircle'
import StarBorder from 'material-ui-icons/StarBorder'
import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography/Typography';
import Avatar from 'material-ui/Avatar/Avatar';


class LobbyPanel extends Component {

  render() {
    return (
      <div>
        <Typography type="headline">
          lobby members
        </Typography>
        <Divider />
        <List>
          {this.props.lobby.members.map(m => {
            const isLeader = this.props.lobby.leaderId === m._id;
            return (
              <ListItem button key={m._id}>
                <ListItemAvatar>
                  <Avatar>
                    {isLeader ? <StarBorder /> : <AccountCircle />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={m.name}
                  secondary={this.props.lobby.leaderId === m._id ? 'Leader' : null}
                  onClick={() => this.props.kick(m._id)}
                />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        <Typography type="headline">
          lobby shoutbox
        </Typography>
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
  },
  kick: id => dispatch(kick(id))
})


export default connect(mapStateToProps, mapDispatchToProps)(LobbyPanel);