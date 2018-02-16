import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button/Button';
import Grid from 'material-ui/Grid/Grid';
import Home from 'material-ui-icons/Home';
import DriveEta from 'material-ui-icons/DriveEta';
import Send from 'material-ui-icons/Send';

import QuestDetails from './quest/QuestDetails';

import { squadConfirm, squadPropose } from '../actions';
import StageWrapper from './StageWrapper';


const ac = require('../acutils');


const styles = theme => ({
  paper: {
    padding: theme.spacing.unit * 2,
    margin: theme.spacing.unit * 2,
    height: '100%',
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  buttonContainer: {
    paddingTop: theme.spacing.unit * 3,
    textAlign: 'center'
  }
});


class StageSquadProposalView extends React.Component {

  render() {
    const { classes } = this.props;
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);
    const squadFull = ac.is.squadFull(store, quest);
    const isCommander = ac.is.commander(store, currentUser._id);

    return (
      <StageWrapper>
        <QuestDetails
          actions={[(memberId) =>
            ac.is.squadMember(quest, memberId) ?
              isCommander === false ? <DriveEta color="primary" /> :
                <Button
                  raised
                  color="primary"
                  mini
                  onClick={() => {
                    this.props.squadPropose(
                      quest.squad.filter(id => id !== memberId)
                    );
                  }}><DriveEta /></Button> :
              isCommander === false ? <Home color="disabled" /> :
                <Button
                  raised
                  color="inherit"
                  mini
                  disabled={squadFull || isCommander === false}
                  onClick={() => {
                    this.props.squadPropose([
                      ...quest.squad,
                      memberId
                    ]);
                  }}><Home /></Button>
          ]}
        />
        {isCommander &&
          <Grid container spacing={0}>
            <Grid item xs={12} className={classes.buttonContainer}>
              <Button
                raised
                color="accent"
                disabled={squadFull === false}
                onClick={() => {
                  this.props.squadConfirm();
                }}
              ><Send /></Button>
            </Grid>
          </Grid>
        }
      </StageWrapper>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  squadPropose: (squad) => dispatch(squadPropose(squad)),
  squadConfirm: () => dispatch(squadConfirm())
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageSquadProposalView)
);
