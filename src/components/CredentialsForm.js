import React, { Component } from 'react';
import { register } from '../logic/user/actions'
import { connect } from "react-redux";

class CredentialsForm extends Component {

  handleSubmit(event) {
    this.props.onSubmit(this.nameInput.value, this.passwordInput.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={event => this.handleSubmit(event)}>
        <div className="row">
          <div className="six columns">
            <label htmlFor="name">Name</label>
            <input className="u-full-width" type="text" ref={e => this.nameInput = e} />
          </div>
          <div className="six columns">
            <label htmlFor="password">Password</label>
            <input className="u-full-width" type="password" ref={e => this.passwordInput = e} />
          </div>
        </div>
        <input className="button-primary" type="submit" value={this.props.submitValue || 'submit'} />
      </form>
    );
  }
}


export default CredentialsForm;
