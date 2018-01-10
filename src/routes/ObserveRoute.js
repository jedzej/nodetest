import React, { Component } from 'react';
import ObserverAppWrapper from '../containers/ObserverAppWrapper';
import { join } from '../logic/observer/actions';
import { connect } from "react-redux";
import ChatBox from '../containers/ChatBox';


class ObserveRoute extends Component {

  render() {
    console.log(this.props.match.params.token)
    return (
      <ObserverAppWrapper token={this.props.match.params.token}>
        <div>OBSERVE {this.props.match.params.token}</div>
        {this.props.lobby.exists ? <ChatBox withFormBox={false} /> :
          <ul>
            {this.props.lobby.lobbiesList.map(lobby =>
              <li key={lobby.token}>
                <span>{lobby.members[0].name}</span>
                <button onClick={() => this.props.join(lobby.token)}>&lt;=</button>
              </li>
            )}
          </ul>}
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
