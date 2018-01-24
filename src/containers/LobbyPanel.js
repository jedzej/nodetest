import React, { Component } from 'react';
import { connect } from 'react-redux';
import withStyles from 'material-ui/styles/withStyles';
import ListItemText from 'material-ui/List/ListItemText';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import AccountCircle from 'material-ui-icons/AccountCircle'
import People from 'material-ui-icons/People'
import Message from 'material-ui-icons/Message'
import StarBorder from 'material-ui-icons/StarBorder'
import Typography from 'material-ui/Typography/Typography';
import Grid from 'material-ui/Grid/Grid';
import Paper from 'material-ui/Paper/Paper';
import Menu from 'material-ui/Menu/Menu';
import MenuItem from 'material-ui/Menu/MenuItem';

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
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
      flex: '0 1 auto',
    },
    chatContainer: {
      flex: '1 1 10px',
      overflowY: 'hidden'
    },
    headline: {
      backgroundColor: theme.palette.primary['300'],
      color: theme.palette.getContrastText(theme.palette.primary['700'])
    },
    headIcon: {
      width: '24px',
      height: '24px',
      padding: theme.spacing.unit
    }
  }
};

class LobbyList extends React.Component {

  state = {
    anchorEl: null,
    memberId: null
  };

  handleClick = (event, memberId) => {
    this.setState({
      anchorEl: event.currentTarget,
      memberId
    });
  };

  handleClose = () => {
    this.setState({
      memberId: null,
      anchorEl: null
    });
  };

  handleKick = () => {
    this.props.onKick(this.state.memberId);
    this.handleClose();
  }

  render() {
    const { anchorEl, memberId } = this.state;
    const { canKick, members, leaderId } = this.props;
    return (
      <div>
        <List spacing={0}>
          {members.map(m => {
            const isLeader = m._id === leaderId;
            return (
              <ListItem button key={m._id}
                onClick={(event) => this.handleClick(event, m._id)}
              >
                {isLeader ? <StarBorder /> : <AccountCircle />}
                <ListItemText
                  primary={m.name}
                  secondary={isLeader ? 'Leader' : null}

                />
              </ListItem>
            );
          })}
        </List>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          open={canKick && memberId !== leaderId && Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem onClick={this.handleKick}>Kick </MenuItem> : null
        </Menu>
      </div>
    );
  }
}

class LobbyPanel extends Component {

  render() {
    const { classes, lobby, user } = this.props;
    return (
      <div className={classes.container}>
        <header>
          <Paper>
            <Grid container spacing={0}
              className={classes.headline}
              alignItems="center"
            >
              <Grid item>
                <People className={classes.headIcon} />
              </Grid>
              <Grid item>
                <Typography type='title' color="inherit">
                  {"members"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
          <LobbyList
            leaderId={lobby.leaderId}
            members={lobby.members}
            canKick={lobby.leaderId === user._id}
            onKick={(memberId) => this.props.kick(memberId)}
          />
        </header>

        <Paper>
          <Grid container spacing={0} className={classes.headline}
            alignItems="center">
            <Grid item>
              <Message className={classes.headIcon} />
            </Grid>
            <Grid item>
              <Typography type='title' color='inherit'>
                {"shoutbox"}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
        <section className={classes.chatContainer}>
          <ChatBox withFormBox />
        </section>
      </div >
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
