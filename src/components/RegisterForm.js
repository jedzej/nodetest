import React, { Component } from 'react';
import { register } from '../logic/user/actions'
import { connect } from "react-redux";

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      name: '',
      password: ''
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.props.register(this.state.name, this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="row">
          <div className="six columns">
            <label htmlFor="name">Name</label>
            <input className="u-full-width" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
          </div>
          <div className="six columns">
            <label htmlFor="password">Password</label>
            <input className="u-full-width" type="password" name="password" value={this.state.password} onChange={this.handleChange} />
          </div>
        </div>
        <input className="button-primary" type="submit" value="Submit" />
      </form>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    register: (name, password) => {
      dispatch(register(name, password));
    }
  };
};

export default connect(null, mapDispatchToProps)(RegisterForm);
