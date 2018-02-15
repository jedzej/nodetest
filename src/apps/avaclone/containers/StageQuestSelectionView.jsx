import React from 'react';
import { connect } from "react-redux";
import withStyles from 'material-ui/styles/withStyles';
import Button from 'material-ui/Button/Button';
import Map from 'material-ui-icons/Map';

import QuestsList from './quest/QuestsList';
import StageWrapper from './StageWrapper';

import { questSelect } from '../actions';

const ac = require('../acutils');


const styles = theme => ({});

class StageQuestSelectionView extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;
    const isCommander = ac.is.commander(store, currentUser._id);
    return (
      <StageWrapper>
        <QuestsList actions={[quest => (
          ac.is.quest.taken(quest) === false && isCommander &&
          <Button
            raised
            dense
            mini
            key={quest.number}
            onClick={() => this.props.questSelect(quest.number)}
          ><Map /></Button>
        )]} />
      </StageWrapper>
    );
  }
}


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  user: state.user
});

const mapDispatchToProps = (dispatch) => ({
  questSelect: (number) => dispatch(questSelect(number))
})


export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(StageQuestSelectionView)
);
