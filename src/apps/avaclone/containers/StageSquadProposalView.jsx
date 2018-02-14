import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import PropTypes from 'prop-types';

import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { questSelect, squadConfirm, squadPropose } from '../actions';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Grid from 'material-ui/Grid/Grid';
import QuestInfo from './quest/QuestInfo';
import QuestDetails from './quest/QuestDetails';
import Home from 'material-ui-icons/Home';
import DriveEta from 'material-ui-icons/DriveEta';
import Send from 'material-ui-icons/Send';
import ProgressTable from './progress/ProgressTable';
import ActionTip from './common/ActionTip';
import Divider from 'material-ui/Divider';

const ac = require('../acutils');


const styles = theme => {
  console.log(theme); return ({
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
    },
    settingsButton: {
      position: 'absolute',
      top: '10px',
      right: '10px'
    },
    undoButton: {
      position: 'absolute',
      bottom: '10px',
      right: '50px'
    },
    undoButtonDisabled: {
      position: 'absolute',
      color: '#CCC',
      bottom: '10px',
      right: '50px'
    },
    clearButton: {
      position: 'absolute',
      bottom: '10px',
      right: '90px'
    },
    paletteButton: {
      position: 'absolute',
      bottom: '10px',
      right: '10px'
    },
    canvasContainer: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#fff'
    }
  })
};


class StageSquadProposalView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const quest = ac.get.currentQuest(store);
    const squadFull = ac.is.squadFull(store, quest);
    const isCommander = ac.is.commander(store, currentUser._id);

    return (
      <Paper>
        <ProgressTable />
        <QuestInfo strong align="center" questNumber={quest.number} />
        <Divider/>
        <ActionTip/>
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
            <Grid item xs={12}>
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
      </Paper>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    lobby: state.lobby,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  questSelect: (number) => dispatch(questSelect(number)),
  squadPropose: (squad) => dispatch(squadPropose(squad)),
  squadConfirm: () => dispatch(squadConfirm()),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})

StageSquadProposalView.propTypes = {
  open: PropTypes.bool,
  onChangeComplete: PropTypes.func,
  onClose: PropTypes.func,
  color: PropTypes.string,
};


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageSquadProposalView)
);
