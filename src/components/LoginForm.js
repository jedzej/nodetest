import React, { Component } from 'react';
import { login } from '../logic/user/actions'
import { connect } from "react-redux";

class LoginForm extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      name : '',
      password : ''
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    this.props.login(this.state.name, this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          Login
        </div>
        <label>
          Name:
          <input type="text" name="name" value={this.state.name} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    login: (name, password) => {
      dispatch(login(name, password));
    }
  };
};

export default connect(null, mapDispatchToProps)(LoginForm);
