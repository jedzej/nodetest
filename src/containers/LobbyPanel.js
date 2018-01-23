import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'material-ui/styles/withStyles';
import ListItemText from 'material-ui/List/ListItemText';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ListItemAvatar from 'material-ui/List/ListItemAvatar';
import AccountCircle from 'material-ui-icons/AccountCircle'
import People from 'material-ui-icons/People'
import Message from 'material-ui-icons/Message'
import StarBorder from 'material-ui-icons/StarBorder'
import Typography from 'material-ui/Typography/Typography';
import Avatar from 'material-ui/Avatar/Avatar';
import Grid from 'material-ui/Grid/Grid';

import { join, leave, kick } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'
import ChatBox from './ChatBox';


const styles = theme => {
  console.log(theme);
  return {

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
      overflowY: 'hidden'
    },
    headline: {
      backgroundColor: theme.palette.primary[500],
      color: theme.palette.getContrastText(theme.palette.primary[500]),
      ...theme.mixins.toolbar
    },
    headIcon: {
      width: '36px',
      height: '36px'
    }
  }
};

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
          <div className={classes.headline}>
            <Grid container spacing={0}>
              <Grid item>
                <People className={classes.headIcon} />
              </Grid>
              <Grid item>
                <Typography type='headline' color="inherit">
                  {"members"}
                </Typography>
              </Grid>
            </Grid>
          </div>
          <LobbyList
            leaderId={this.props.lobby.leaderId}
            members={this.props.lobby.members}
            onClick={(memberId) => this.props.kick(memberId)}
          />
        </header>
        <div className={classes.headline}>
          <Grid container spacing={0}>
            <Grid item>
              <Message className={classes.headIcon} />
            </Grid>
            <Grid item>
              <Typography type='headline' color='inherit'>
                {"shoutbox"}
              </Typography>
            </Grid>
          </Grid>
        </div>
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
