import React from 'react';
import { connect } from "react-redux";
import PropTypes from 'prop-types';

import MembersList from '../common/MembersList';
import CharIcon from './CharIcon';

import MANIFEST from '../../manifest';

const ac = require('../../acutils');

const { CHAR } = MANIFEST.CONSTS;

class CharactersList extends React.Component {

  render() {
    const { store } = this.props.avaclone;
    const currentUser = this.props.user;

    const hideAction = memberId => <CharIcon char={CHAR.GOOD} />

    const exposeAction = memberId => {
      const char = currentUser._id === memberId ?
        ac.get.char(store, memberId) : ac.get.charFor(store, currentUser._id, memberId)
      return <CharIcon char={char} />;
    }

    return (
      <MembersList
        caption={this.props.caption || ""}
        actions={[this.props.expose ? exposeAction : hideAction]}
      />
    );
  }
}

CharactersList.propTypes = {
  actions: PropTypes.array
};


const mapStateToProps = (state) => ({
  avaclone: state.avaclone,
  lobby: state.lobby,
  user: state.user
});


export default connect(mapStateToProps, null)(CharactersList);
