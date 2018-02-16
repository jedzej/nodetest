import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import MembersList from '../common/MembersList';

const ac = require('../../acutils');


class QuestDetails extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const { actions } = this.props;
    const quest = ac.get.currentQuest(store);
    const caption = member => {
      const roles = [];
      if (ac.is.commander(store, member._id))
        roles.push('commander');
      if (ac.is.squadMember(quest, member._id))
        roles.push('in squad');
      if (roles.length === 0)
        roles.push('-');
      return roles.join(', ');
    };

    return (
      <MembersList
        caption={caption}
        actions={actions}
      />
    );
  }
}

QuestDetails.propTypes = {
  actions: PropTypes.array
};


const mapStateToProps = (state) => {
  return {
    avaclone: state.avaclone,
    lobby: state.lobby,
    user: state.user
  };
};


export default connect(mapStateToProps, null)(QuestDetails);
