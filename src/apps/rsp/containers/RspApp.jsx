import React from 'react';
import { connect } from "react-redux";
import { move, terminate } from '../actions';
import Button from 'material-ui/Button/Button';
import RockIconData from '../../../images/rockIcon.svg';
import PaperIconData from '../../../images/paperIcon.svg';
import ScissorsIconData from '../../../images/scissorsIcon.svg';
import SvgIcon from 'material-ui/SvgIcon';
console.log(RockIconData)

const RockIcon = props => (
  <img {...props} src={RockIconData} />
);

const PaperIcon = props => (
  <img {...props} src={PaperIconData} />
);

const ScissorsIcon = props => (
  <img {...props} src={ScissorsIconData} />
);

const getMatch = (rspState, lobbyState, cond) => {
  var match = cond(rspState.player1) ? rspState.player1 : rspState.player2;
  return {
    ...match,
    ...lobbyState.members.find(m => m.id == match.id)
  };
}

const getMe = (rspState, lobbyState, userState) => getMatch(
  rspState,
  lobbyState,
  player => player.id === userState.id
)

const getOpponent = (rspState, lobbyState, userState) => getMatch(
  rspState,
  lobbyState,
  player => player.id !== userState.id
)


const getFinishedRounds = rspState => Math.floor((
  rspState.player1.moves.length +
  rspState.player2.moves.length) / 2);

class RspApp extends React.Component {

  renderPointsTable(me, opponent, roundNumber) {
    return (
      <div>
        Round {roundNumber} of {this.props.rsp.roundLimit}<br />
        {me.name} : {me.points} vs {opponent.points} : {opponent.name}
      </div>
    );
  }

  renderMoveButtons() {
    return (
      <div>
        <Button onClick={() => this.props.rspMove('rock')}><RockIcon width={100} /></Button>
        <Button onClick={() => this.props.rspMove('paper')}><PaperIcon width={100}/></Button>
        <Button onClick={() => this.props.rspMove('scissors')}><ScissorsIcon width={100}/></Button>
      </div>
    );
  }

  renderOngoingOpponentsMove(me, opponent) {
    return (
      <div>
        {this.renderPointsTable(me, opponent)}
        <br /><br />
        Waiting for oponent...
      </div>
    );
  }

  renderOngoingYourMove(me, opponent) {
    return (
      <div>
        {this.renderPointsTable(me, opponent, getFinishedRounds(this.props.rsp) + 1)}
        <br /><br />
        Your move! <br />
        {this.renderMoveButtons()}
      </div>
    );
  }

  renderOngoing(me, opponent) {
    return <div>
      {me.moves.length <= opponent.moves.length ?
        this.renderOngoingYourMove(me, opponent) :
        this.renderOngoingOpponentsMove(me, opponent)}
    </div>
  }

  renderComplete(me, opponent) {
    var result = me.points - opponent.points
    var winner = undefined;
    if (result > 0) {
      winner = me;
    } else if (result < 0) {
      winner = opponent;
    }
    if (winner) {
      result = <div>{winner.name} wins!</div>;
    } else {
      result = <div>TIE</div>;
    }
    return (
      <div>
        {this.renderPointsTable(me, opponent, getFinishedRounds(this.props.rsp))}<br />
        {result}
        <br /><br />
        <Button onClick={() => this.props.rspTerminate()}>TERMINATE</Button>
      </div>
    );
  }

  render() {
    console.log(this.props)
    try {
      var me = getMe(this.props.rsp, this.props.lobby, this.props.user);
      var opponent = getOpponent(this.props.rsp, this.props.lobby, this.props.user);

      switch (this.props.rsp.stage) {
        case 'ongoing':
          return this.renderOngoing(me, opponent);
          break;
        case 'complete':
          return this.renderComplete(me, opponent);
          break;
        default:
          break;
      }
    } catch (err) {
      console.log(err)
      return <div />
    }
  }
}

const mapStateToProps = (state) => {
  return {
    rsp: state.rsp,
    lobby: state.lobby,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspMove: (variant) => dispatch(move(variant)),
  rspTerminate: (variant) => dispatch(terminate()),
})


export default connect(mapStateToProps, mapDispatchToProps)(RspApp);

