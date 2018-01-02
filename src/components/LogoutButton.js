import React, { Component } from 'react';
import { connect } from "react-redux";
import { logout } from '../logic/user/actions'

class LogoutButton extends Component {
  render() {
    return (
      <button onClick={this.props.logout}>LOGOUT</button>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch(logout());
  }
});

export default connect(null, mapDispatchToProps)(LogoutButton);
