import React from 'react';
import { connect } from "react-redux";
import { move } from '../actions';
import Button from 'material-ui/Button/Button';


class RspApp extends React.Component {
  render() {
    return <div>
      <Button onClick={() => this.props.rspMove('rock')}>ROCK</Button><br />
      <Button onClick={() => this.props.rspMove('paper')}>PAPER</Button><br />
      <Button onClick={() => this.props.rspMove('scissors')}>SCISSORS</Button><br /><br />
      {JSON.stringify(this.props.rsp.player1.moves)} vs

      {JSON.stringify(this.props.rsp.player2.moves)}<br />
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    rsp: state.rsp,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspMove: (variant) => {
    dispatch(move(variant));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(RspApp);

