import React, { Component } from 'react';
import { connect } from "react-redux";
import { join, leave } from '../logic/lobby/actions'
import { message } from '../logic/chat/actions'
import Card from 'material-ui/Card/Card';
import { start } from '../apps/rsp/actions';

class AppSelector extends Component {

  render() {
    return (
      <Card>
        Rock-Scissors-Paper
        <button onClick={this.props.rspStart}>START</button>
      </Card>
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
  rspStart: (msg) => {
    dispatch(start(msg));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(AppSelector);
