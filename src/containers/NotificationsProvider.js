import React, { Component } from 'react';
import { connect } from "react-redux";
import Notifications from 'react-notification-system-redux';

class NotificationsWrapper extends Component {
  render() {
    return (
      <div>
        {this.props.children}
        <Notifications notifications={this.props.notifications} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.notifications
  };
};

export default connect(mapStateToProps, null)(NotificationsWrapper);
