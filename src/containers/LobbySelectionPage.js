import React, { Component } from 'react';
import { connect } from "react-redux";
import { create, join, list } from '../logic/lobby/actions'

class LobbySelectionPage extends Component {
  constructor(props) {
    super(props);
    this.handleCreate = this.handleCreate.bind(this);
  }

  handleCreate(event) {
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <h4>Create lobby</h4>
        <button onClick={this.props.create}>CREATE</button>
        <h4>Join lobby</h4>
        <ul>
          {this.props.lobby.lobbiesList.map(lobby =>
            <li key={lobby.token}>
              <span>{lobby.members[0].name}</span>
              <button onClick={() => this.props.join(lobby.token)}>&lt;=</button>
            </li>
          )}
        </ul>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  create: () => dispatch(create()),
  join: (token) => dispatch(join(token))
})


export default connect(mapStateToProps, mapDispatchToProps)(LobbySelectionPage);