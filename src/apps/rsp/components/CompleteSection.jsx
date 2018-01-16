import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { ScissorsIcon, RockIcon, PaperIcon, RSPMoveIcon } from './RSPIcons';
import { RESULT, MOVE } from '../core';
import MutatorIcon from './MutatorIcon';
import Grid from 'material-ui/Grid/Grid';
import Button from 'material-ui/Button/Button';
import Typography from 'material-ui/Typography/Typography';
import SentimentVerySatisfied from 'material-ui-icons/SentimentVerySatisfied';
import SentimentVeryDissatisfied from 'material-ui-icons/SentimentVeryDissatisfied';
import SentimentNeutral from 'material-ui-icons/SentimentNeutral';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    padding: theme.spacing.unit * 3,
    textAlign: 'center'
  },
  buttonCell: {
    textAlign: 'center',
    width: '80px'
  },
  button: {
    width: '60%',
    height: '60%'
  },
});

const ResultBox = props => (
  <Grid container>
    <Grid item xs={4} style={{ textAlign: 'right' }}>
      <props.icon style={{ height: '50px', width: '50px' }}  color={props.color}/>
    </Grid>
    <Grid item xs={4}>
      <Typography type="headline" color={props.color}> {props.headline} </Typography>
    </Grid>
    <Grid item xs={4} style={{ textAlign: 'left' }}>
      <props.icon style={{ height: '50px', width: '50px' }}  color={props.color}/>
    </Grid>
  </Grid>
);

const VictoryBox = props => <ResultBox icon={SentimentVerySatisfied} headline="you won" color="primary" />;

const DefeatBox = props => <ResultBox icon={SentimentVeryDissatisfied} headline="you lost" color="accent" />;

const TieBox = props => <ResultBox icon={SentimentNeutral} headline="tie" color="inherit" />;


class CompleteSection extends Component {
  render() {
    const { classes } = this.props;
    return (
      <Paper>
        <Grid container spacing={20} justify="center" className={classes.root}>
          <Grid item xs={12}>
            {(() => {
              switch (this.props.result) {
                case RESULT.VICTORY:
                  return <VictoryBox />
                case RESULT.DEFEAT:
                  return <DefeatBox />
                default:
                  return <TieBox />
              }
            })()}
            <Button disabled={!this.props.terminateable} raised onClick={() => this.props.onTerminate()}>TERMINATE</Button>
          </Grid>
        </Grid>
      </Paper>
    );
  }

}

CompleteSection.propTypes = {
  classes: PropTypes.object.isRequired,
  result: PropTypes.string,
  terminateable: PropTypes.bool,
  onTerminate: PropTypes.func
};

export default withStyles(styles)(CompleteSection);
