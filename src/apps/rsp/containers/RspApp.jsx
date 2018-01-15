import React from 'react';
import { connect } from "react-redux";
import { move, terminate } from '../actions';
import Button from 'material-ui/Button/Button';
import { RSPMoveIcon } from '../components/RSPIcons'
import PointsTable from '../components/PointsTable';
import { MOVE } from '../core'
import Grid from 'material-ui/Grid/Grid';
import withStyles from 'material-ui/styles/withStyles';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  demo: {
    height: 240,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    height: '100%',
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});


const getMatch = (rspState, lobbyState, cond) => {
  var match = cond(rspState.player1) ? rspState.player1 : rspState.player2;
  return {
    ...match,
    ...lobbyState.members.find(m => m.id === match.id)
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


const moveButtonStyle = {
  width: '90%',
  height: '90%'
}


class RspApp extends React.Component {

  renderMoveButtons() {
    return (
      <Grid container spacing={40} justify="center" className={this.props.classes.root}>
        {Object.values(MOVE).map(move =>
          <Grid item xs style={{textAlign:'center',width:'100px'}} key={move}>
            <Button fab color="primary" aria-label={move} onClick={() => this.props.rspMove(move)}>
              <RSPMoveIcon move={move} style={moveButtonStyle} />
            </Button>
          </Grid>
        )}
      </Grid>
    );
  }

  renderOngoingOpponentsMove(me, opponent) {
    return (
      <div>
        <PointsTable me={me} opponent={opponent} roundLimit={this.props.rsp.roundLimit} />
        <br /><br />
        Waiting for oponent...
      </div>
    );
  }

  renderOngoingYourMove(me, opponent) {
    return (
      <div>
        <PointsTable me={me} opponent={opponent} roundLimit={this.props.rsp.roundLimit} />
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
        <PointsTable me={me} opponent={opponent} roundLimit={this.props.rsp.roundLimit} />
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
        case 'complete':
          return this.renderComplete(me, opponent);
        default:
        return <div/>
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


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(RspApp));

