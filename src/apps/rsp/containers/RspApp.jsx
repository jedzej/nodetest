import React from 'react';
import { connect } from "react-redux";
import { move } from '../actions';
import { terminate } from '../../../logic/app/actions';
import PointsTable from '../components/PointsTable';
import { rspMatch } from '../core'
import withStyles from 'material-ui/styles/withStyles';
import MoveSection from '../components/MoveSection';
import Typography from 'material-ui/Typography/Typography';
import CompleteSection from '../components/CompleteSection';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  headline: {
    paddingBottom: theme.spacing.unit * 2
  }
});


const getMatch = (rspState, lobbyState, cond) => {
  var match = cond(rspState.player1) ? rspState.player1 : rspState.player2;
  console.log('match', match, lobbyState.members)
  return {
    ...match,
    ...lobbyState.members.find(m => m._id === match._id)
  };
}

const getMe = (rspState, lobbyState, userState) => getMatch(
  rspState,
  lobbyState,
  player => {
    console.log("getMe", player, userState)
    return player._id === userState._id;
  }
)

const getOpponent = (rspState, lobbyState, userState) => getMatch(
  rspState,
  lobbyState,
  player => player._id !== userState._id
)

class RspApp extends React.Component {

  renderOngoing(me, opponent) {
    const opponentsTurn = me.moves.length > opponent.moves.length;
    return (
      <div>
        <PointsTable me={me} opponent={opponent} roundLimit={this.props.rsp.roundLimit} />
        <br />
        <MoveSection disabled={opponentsTurn} onClick={move => this.props.rspMove(move)}>
          <Typography type="headline" align="center" gutterBottom className={this.props.classes.headline}>
            {opponentsTurn ? "waiting for opponent" : "your move"}
          </Typography>
        </MoveSection>
      </div>
    );
  }

  renderComplete(me, opponent) {
    const result = rspMatch(me, opponent);
    const isLeader = this.props.lobby.leaderId === this.props.user._id;
    return (
      <div>
        <PointsTable me={me} opponent={opponent} roundLimit={this.props.rsp.roundLimit} />
        <CompleteSection
          terminateable={isLeader}
          result={result}
          onTerminate={() => this.props.rspTerminate()} />
      </div>
    );
  }

  render() {
    console.log(this.props)
    try {
      const me = getMe(this.props.rsp, this.props.lobby, this.props.user);
      const opponent = getOpponent(this.props.rsp, this.props.lobby, this.props.user);

      switch (this.props.rsp.stage) {
        case 'ongoing':
          return this.renderOngoing(me, opponent);
        case 'complete':
          return this.renderComplete(me, opponent);
        default:
          return <div />
      }
    } catch (err) {
      console.log(err)
      return <div />
    }
  }
}

const mapStateToProps = (state) => {
  console.log(state)
  return {
    rsp: state.app.rsp.store,
    lobby: state.lobby,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspMove: (variant) => dispatch(move(variant)),
  rspTerminate: (variant) => dispatch(terminate('rsp')),
})


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RspApp));

