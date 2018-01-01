import React, { Component } from 'react';
import { register } from '../logic/user/actions'
import { connect } from "react-redux";

class RegisterForm extends Component {
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
    console.log('lloool')
    this.props.register(this.state.name, this.state.password);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <div>
          Register
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
    register: (name, password) => {
      dispatch(register(name, password));
    }
  };
};

export default connect(null, mapDispatchToProps)(RegisterForm);
