import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { terminate } from '../../../logic/app/actions';
import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import Typography from 'material-ui/Typography/Typography';

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


class CompleteView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;

    const failedCount = ac.sum.failedQuests(store);
    const succeededCount = ac.sum.succeededQuests(store);

    return (
      <Paper>
        {failedCount > succeededCount ?
          <Typography>Good win</Typography> :
          <Typography>Evil win</Typography>
        }
        <Button
          disabled={currentUser.isLeader === false}
          onClick={() => this.props.terminate()}>
          Terminate
        </Button>
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
  terminate: () => {
    dispatch(terminate());
  },
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(CompleteView)
);
