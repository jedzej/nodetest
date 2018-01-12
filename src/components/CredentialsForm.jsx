import React, { Component } from 'react';
import Button from 'material-ui/Button';
import Card from 'material-ui/Card';

class CredentialsForm extends Component {

  handleSubmit(event) {
    this.props.onSubmit(this.nameInput.value, this.passwordInput.value);
    event.preventDefault();
  }

  render() {
    return (
      <Card>
        {this.props.children}
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
          <Button raised type="submit" color="primary">{this.props.submitValue || 'submit'}</Button>
        </form>
      </Card>
    );
  }
}


export default CredentialsForm;
