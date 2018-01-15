import React, { Component } from 'react';
import { connect } from "react-redux";
import { create, join } from '../logic/lobby/actions';
import UserAppWrapper from '../containers/UserAppWrapper';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Typography from 'material-ui/Typography';
import AppBar from 'material-ui/AppBar';
import LobbySelector from '../components/LobbySelector';
import AppLayout from '../containers/AppLayout';
import AppLayoutPartial from '../containers/AppLayoutPartial';
import TopBar from '../containers/TopBar';


class NoLobbyRoute extends Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(event) {
    event.preventDefault();
  }

  render() {
    return (
      <UserAppWrapper>
        <AppLayout>
          <AppLayoutPartial key="top">
            <TopBar />
          </AppLayoutPartial>
          <AppLayoutPartial key="main">
            <Grid container spacing={16}>
              <Grid item xs={12} sm={6}>
                <AppBar position="static" color="inherit">
                  <Typography type="title" color="inherit">Create lobby</Typography>
                </AppBar>
                <Paper>
                  <Button onClick={this.props.create}>CREATE</Button>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <AppBar position="static" color="inherit">
                  <Typography type="title" color="inherit">Join lobby</Typography>
                </AppBar>
                <Paper>
                  <LobbySelector lobbies={this.props.lobby.lobbiesList} onJoin={this.props.join} />
                </Paper>
              </Grid>
            </Grid>
          </AppLayoutPartial>
        </AppLayout>
      </UserAppWrapper >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  create: () => dispatch(create()),
  join: (token) => dispatch(join(token))
})


export default connect(mapStateToProps, mapDispatchToProps)(NoLobbyRoute);
