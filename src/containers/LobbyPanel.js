import React, { Component } from 'react';
import { connect } from "react-redux";
import { join, leave } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'
import ChatBox from './ChatBox';
import Button from 'material-ui/Button/Button';
import ListItemText from 'material-ui/List/ListItemText';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import AccountCircle from 'material-ui-icons/AccountCircle'
import StarBorder from 'material-ui-icons/StarBorder'
import Divider from 'material-ui/Divider/Divider';
import Typography from 'material-ui/Typography/Typography';
import { withStyles } from 'material-ui/styles';


const styles = theme => ({
  card: {
    display: 'flex',
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});


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
            const isLeader = this.props.lobby.leaderId == m.id;
            return (
              <ListItem button key={m.id}>
                <ListItemAvatar>
                  {isLeader ? <StarBorder /> : <AccountCircle />}
                </ListItemAvatar>
                <ListItemText
                  primary={m.name}
                  secondary={this.props.lobby.leaderId == m.id ? 'Leader' : null}
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
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(LobbyPanel);