import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { ScissorsIcon, RockIcon, PaperIcon } from './RSPIcons';
import { rspMatch, MOVE_SCISSORS, MOVE_ROCK, MOVE_PAPER, VICTORY, DEFEAT } from '../core';

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

const MoveIcon = (props) => {
  switch (props.move) {
    case MOVE_SCISSORS:
      return <ScissorsIcon {...props} />
    case MOVE_ROCK:
      return <RockIcon {...props} />
    case MOVE_PAPER:
      return <PaperIcon {...props} />
    default:
      return ''
  }
}

const PointsTable = props => {
  const { classes, roundLimit } = props;

  const movesFill = (moves, opponentMoves, len) => [...moves, ...Array(len - moves.length).fill()]
    .map((move, i) => [move, rspMatch(move, opponentMoves[i])]);

  const data = {
    rounds: [...Array(roundLimit).keys()].map(e => e + 1),
    players: [
      {
        name: props.me.name,
        moves: movesFill(props.me.moves, props.opponent.moves, roundLimit)
      },
      {
        name: props.opponent.name,
        moves: movesFill(props.opponent.moves, props.me.moves, roundLimit)
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
              <TableCell numeric className={classes.cell}>Ro {number}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.players.map(player => (
            <TableRow key={player.name}>
              <TableCell className={classes.cell}>{player.name}</TableCell>
              {player.moves.map(([move, result], i) => (
                <TableCell numeric className={classes.cell}>
                  <MoveIcon move={move} color={result === VICTORY ? "accent" : result === DEFEAT ? "disabled" : "default"} />
                </TableCell>
              ))}
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
