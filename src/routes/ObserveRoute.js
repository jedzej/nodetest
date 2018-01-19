import React, { Component } from 'react';
import ObserverAppWrapper from '../containers/ObserverAppWrapper';
import { join } from '../logic/observer/actions';
import { connect } from "react-redux";
import InLobbyRoute from './InLobbyRoute';

const LobbyObserveSelector = props => (
  <ul>
    {props.lobbiesList.map(lobby =>
      <li key={lobby.token}>
        <span>{lobby.members[0].name}</span>
        <button onClick={() => this.props.join(lobby.token)}>
          &lt;=
        </button>
      </li>
    )}
  </ul>
);

class ObserveRoute extends Component {

  render() {
    console.log(this.props.match.params.token)
    return (
      <ObserverAppWrapper token={this.props.match.params.token}>
        {(() => {
          if (this.props.lobby.exists)
            return <InLobbyRoute />
          else
            return <LobbyObserveSelector
              lobbiesList={this.props.lobby.lobbiesList} />
        })()}
      </ObserverAppWrapper>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  join: (token) => dispatch(join(token))
})


export default connect(mapStateToProps, mapDispatchToProps)(ObserveRoute);
