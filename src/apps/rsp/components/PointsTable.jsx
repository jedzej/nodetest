import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { ScissorsIcon, RockIcon, PaperIcon, RSPMoveIcon } from './RSPIcons';
import { rspMatch, RESULT } from '../core';
import MutatorIcon from './MutatorIcon';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    //minWidth: 700,
  },
  cell: {
    padding: '0 10px;'
  }
});

const colorMap = {
  [RESULT.VICTORY]: 'accent',
  [RESULT.DEFEAT]: 'disabled',
  [RESULT.TIE]: 'primary',
  [RESULT.UNKNOWN]: 'disabled',
}

const MOVE_HIDDEN = 'hidden'


const result2color = result => colorMap[result];

const PointsTable = props => {
  const { classes, roundLimit } = props;

  const movesFill = (moves, opponentMoves, len, mutateOffset) => {
    if (mutateOffset && moves.length > opponentMoves.length) {
      moves = [...moves.slice(0, -1), MOVE_HIDDEN];
    }
    return [...moves, ...Array(len - moves.length).fill()]
      .map((move, i) => [move, rspMatch(move, opponentMoves[i])]);
  }

  const data = {
    rounds: [...Array(roundLimit).keys()].map(e => e + 1),
    players: [
      {
        name: props.me.name,
        moves: movesFill(props.me.moves, props.opponent.moves, roundLimit)
      },
      {
        name: props.opponent.name,
        moves: movesFill(props.opponent.moves, props.me.moves, roundLimit, true)
      }
    ]
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell className={classes.cell}></TableCell>
            {data.rounds.map(number => (
              <TableCell key={number} numeric className={classes.cell}>Ro {number}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.players.map(player => (
            <TableRow key={player.name}>
              <TableCell className={classes.cell}>{player.name}</TableCell>
              {player.moves.map(([move, result], i) => (
                <TableCell key={i} numeric className={classes.cell}>
                  {move === MOVE_HIDDEN ?
                    <MutatorIcon icons={[ScissorsIcon, RockIcon, PaperIcon]} interval={100} color="inherit" /> :
                    <RSPMoveIcon move={move} color={result2color(result)} />
                  }
                </TableCell>
              )
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

PointsTable.propTypes = {
  classes: PropTypes.object.isRequired,
  me: PropTypes.object.isRequired,
  opponent: PropTypes.object.isRequired,
  roundLimit: PropTypes.number.isRequired
};

export default withStyles(styles)(PointsTable);
