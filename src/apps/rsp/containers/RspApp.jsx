import React from 'react';
import { connect } from "react-redux";
import { move, terminate } from '../actions';
import Button from 'material-ui/Button/Button';


class RspApp extends React.Component {

  renderOngoing() {
    return <div>
      <Button onClick={() => this.props.rspMove('rock')}>ROCK</Button><br />
      <Button onClick={() => this.props.rspMove('paper')}>PAPER</Button><br />
      <Button onClick={() => this.props.rspMove('scissors')}>SCISSORS</Button><br /><br />
      {JSON.stringify(this.props.rsp.player1.moves)} vs
        {JSON.stringify(this.props.rsp.player2.moves)}<br />
    </div>
  }

  renderComplete() {
    return <Button onClick={() => this.props.rspTerminate()}>TERMINATE</Button>
  }

  render() {
    switch (this.props.rsp.stage) {
      case 'ongoing':
        return this.renderOngoing();
        break;
      case 'complete':
        return this.renderComplete();
        break;
      default:
        break;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    rsp: state.rsp,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspMove: (variant) => dispatch(move(variant)),
  rspTerminate: (variant) => dispatch(terminate()),
})


export default connect(mapStateToProps, mapDispatchToProps)(RspApp);

