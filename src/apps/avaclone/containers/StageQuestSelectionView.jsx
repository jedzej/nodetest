import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';

import { logout } from '../../../logic/user/actions';
import { leave } from '../../../logic/lobby/actions';
import { questSelect } from '../actions';

import Button from 'material-ui/Button/Button';
import Paper from 'material-ui/Paper/Paper';
import ProgressTable from './progress/ProgressTable';
import QuestsList from './quest/QuestsList';

import Map from 'material-ui-icons/Map';

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


class StageQuestSelectionView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const isCommander = ac.is.commander(store, currentUser._id);
    return (
      <Paper>
        <ProgressTable />
        <QuestsList actions={[quest => (
          ac.is.quest.taken(quest) === false && isCommander &&
          <Button
            raised
            dense
            mini
            key={quest.number}
            onClick={() => this.props.questSelect(quest.number)}
          ><Map/></Button>
        )]} />
      </Paper>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    user: state.user
  };
};

const mapDispatchToProps = (dispatch) => ({
  questSelect: (number) => dispatch(questSelect(number)),
  logout: () => {
    dispatch(logout());
  },
  leave: () => {
    dispatch(leave())
  }
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageQuestSelectionView)
);
