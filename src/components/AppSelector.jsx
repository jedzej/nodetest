import React, { Component } from 'react';
import { connect } from "react-redux";
import { start } from '../logic/app/actions';

import applications from '../applications'


class AppSelector extends Component {

  render() {
    const { props } = this;
    console.log(applications)
    return (
      <div>
        {Object.values(applications).map(app => {
          console.log(app)
          return (
            <app.CARD
              key={app.MANIFEST.NAME}
              lobby={props.lobby}
              user={props.user}
              onStart={() => props.rspStart(app.MANIFEST.NAME)} />
          )
        })}
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    user: state.user,
    lobby: state.lobby
  };
};

const mapDispatchToProps = (dispatch) => ({
  rspStart: (name) => {
    dispatch(start(name));
  }
})


export default connect(mapStateToProps, mapDispatchToProps)(AppSelector);
